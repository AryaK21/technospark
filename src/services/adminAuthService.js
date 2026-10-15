// ============================================================================
// SUPABASE ADMIN AUTH & ACCESS REQUESTS SERVICE
// ============================================================================
// Manages Google OAuth authentication, administrator profile resolution,
// role-based permissions (Administrator vs Editor), and pending access requests.
//
// Tables:
// 1. public.admin_users:
//    - id: uuid (gen_random_uuid())
//    - user_id: uuid (references auth.users.id)
//    - email: varchar
//    - name: varchar
//    - avatar_url: text
//    - role: varchar ('Administrator' | 'Editor')
//    - last_active: timestamptz
//
// 2. public.requests:
//    - id: int8 (identity/sequence)
//    - emai: varchar (applicant Google email)
//    - name: varchar (applicant full name)
//    - status: varchar ('pending' | 'approved' | 'rejected')
//    - "created at": timestamptz
// ============================================================================

import { supabase } from '../lib/supabaseClient';

/**
 * Initiates Google OAuth Sign-In via Supabase.
 * Redirects user back to /admin after authentication.
 */
export async function signInWithGoogle() {
  const redirectUrl = `${window.location.origin}/admin`;
  console.log('[AuthService] Initiating Google OAuth with redirect to:', redirectUrl);
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account'
      }
    }
  });
}

/**
 * Signs out the currently authenticated user from Supabase.
 */
export async function signOutAdmin() {
  return await supabase.auth.signOut();
}

/**
 * Retrieves the current Supabase Auth session and authenticated user.
 */
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn('[AuthService] Error fetching session:', error);
    return { session: null, user: null };
  }
  return { session: data.session, user: data.session?.user || null };
}

/**
 * Normalizes an admin user database row into standard UI fields.
 */
export function normalizeAdminUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    user_id: row.user_id,
    email: row.email || '',
    name: row.name || 'Unnamed Admin',
    avatarUrl: row.avatar_url || '',
    avatar: row.avatar_url || '',
    role: row.role || 'Editor',
    lastActive: row.last_active ? new Date(row.last_active).toLocaleString() : 'Recently active',
    last_active: row.last_active
  };
}

/**
 * Normalizes a request database row (handles 'emai' and 'created at' column quirks).
 */
export function normalizeRequest(row) {
  if (!row) return null;
  const email = row.emai || row.email || '';
  const createdAt = row['created at'] || row.created_at || new Date().toISOString();

  return {
    id: row.id,
    email: email,
    emai: email,
    name: row.name || email.split('@')[0] || 'Applicant',
    status: (row.status || 'pending').toLowerCase(),
    createdAt: createdAt,
    created_at: createdAt
  };
}

/**
 * Fetches the admin profile for an authenticated user.
 * Searches by user_id first, then by email.
 */
export async function getAdminProfile(user) {
  if (!user?.email && !user?.id) return { data: null, error: null };

  const cleanEmail = (user.email || '').trim().toLowerCase();

  try {
    // 1. Try matching user_id
    if (user.id) {
      const { data } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        return { data: normalizeAdminUser(data), error: null };
      }
    }

    // 2. Try matching email directly via ilike
    if (cleanEmail) {
      const { data } = await supabase
        .from('admin_users')
        .select('*')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (data) {
        const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || data.avatar_url;
        if (!data.user_id || (!data.avatar_url && avatarUrl)) {
          await supabase
            .from('admin_users')
            .update({
              user_id: user.id,
              avatar_url: avatarUrl,
              last_active: new Date().toISOString()
            })
            .eq('id', data.id);
        }
        return { data: normalizeAdminUser({ ...data, user_id: user.id, avatar_url: avatarUrl }), error: null };
      }
    }

    // 3. Robust In-Memory Match Fallback:
    // Fetches all rows from admin_users and matches with trim() + lowercase
    // This catches cases where emails have whitespace or case quirks in the database.
    const { data: allAdmins, error: allErr } = await supabase
      .from('admin_users')
      .select('*');

    if (allErr) {
      console.warn('[AuthService] Could not read admin_users table (RLS might be blocking):', allErr);
      return { data: null, error: allErr, isRlsBlocked: true };
    }

    if (allAdmins && allAdmins.length > 0) {
      const matched = allAdmins.find((row) => {
        const rowEmail = (row.email || '').trim().toLowerCase();
        return rowEmail === cleanEmail || (row.user_id && row.user_id === user.id);
      });

      if (matched) {
        console.log('[AuthService] Found matching admin in table via fallback scan:', matched);
        const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || matched.avatar_url;
        await supabase
          .from('admin_users')
          .update({
            user_id: user.id,
            avatar_url: avatarUrl,
            last_active: new Date().toISOString()
          })
          .eq('id', matched.id);

        return { data: normalizeAdminUser({ ...matched, user_id: user.id, avatar_url: avatarUrl }), error: null };
      }
    }

    return { data: null, error: null };
  } catch (err) {
    console.error('[AuthService] getAdminProfile error:', err);
    return { data: null, error: err };
  }
}

/**
 * Checks if admin_users is completely empty.
 * If 0 admins exist, the FIRST user who signs in is automatically granted
 * the initial 'Administrator' role so they can bootstrap and approve others!
 */
export async function bootstrapFirstAdminIfEmpty(user) {
  if (!user?.email) return { bootstrapped: false };

  try {
    const { count, error } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.warn('[AuthService] Could not check admin count:', error);
      return { bootstrapped: false, error };
    }

    if (count === 0) {
      console.log('[AuthService] No admins exist. Bootstrapping first user as Administrator:', user.email);
      const name = user.user_metadata?.full_name || user.email.split('@')[0] || 'Initial Admin';
      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

      const { data, error: insertErr } = await supabase
        .from('admin_users')
        .insert([
          {
            user_id: user.id,
            email: user.email,
            name: name,
            avatar_url: avatarUrl,
            role: 'Administrator',
            last_active: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (insertErr) {
        console.error('[AuthService] Failed to bootstrap initial admin:', insertErr);
        return { bootstrapped: false, error: insertErr };
      }

      return { bootstrapped: true, data: normalizeAdminUser(data) };
    }

    return { bootstrapped: false };
  } catch (err) {
    console.error('[AuthService] bootstrapFirstAdmin error:', err);
    return { bootstrapped: false, error: err };
  }
}

/**
 * Retrieves an applicant's request from the public.requests table.
 */
export async function getUserAccessRequest(user) {
  if (!user?.email) return { data: null, error: null };

  try {
    // Check with 'emai' column (as named in user schema) or fallback 'email'
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .or(`emai.eq.${user.email},name.eq.${user.email}`)
      .order('id', { ascending: false })
      .limit(1);

    if (error) {
      console.warn('[AuthService] Error fetching user request:', error);
      return { data: null, error };
    }

    if (data && data.length > 0) {
      return { data: normalizeRequest(data[0]), error: null };
    }

    return { data: null, error: null };
  } catch (err) {
    console.error('[AuthService] getUserAccessRequest error:', err);
    return { data: null, error: err };
  }
}

/**
 * Automatically creates an access request for a new user if none exists.
 */
export async function createAccessRequest(user) {
  if (!user?.email) return { data: null, error: new Error('User email required') };

  try {
    // First verify if request already exists
    const existing = await getUserAccessRequest(user);
    if (existing.data) {
      return existing;
    }

    const name = user.user_metadata?.full_name || user.email.split('@')[0] || 'New Member';
    const payload = {
      emai: user.email,
      name: name,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('requests')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('[AuthService] Failed to create access request:', error);
      return { data: null, error };
    }

    return { data: normalizeRequest(data), error: null };
  } catch (err) {
    console.error('[AuthService] createAccessRequest exception:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetches all active admin and editor users from public.admin_users.
 */
export async function getAllAdminUsers() {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('last_active', { ascending: false, nullsFirst: false });

    if (error) {
      console.warn('[AuthService] getAllAdminUsers error:', error);
      return { data: [], error };
    }

    return { data: (data || []).map(normalizeAdminUser), error: null };
  } catch (err) {
    console.error('[AuthService] getAllAdminUsers exception:', err);
    return { data: [], error: err };
  }
}

/**
 * Fetches all requests from public.requests.
 */
export async function getAllRequests() {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.warn('[AuthService] getAllRequests error:', error);
      return { data: [], error };
    }

    return { data: (data || []).map(normalizeRequest), error: null };
  } catch (err) {
    console.error('[AuthService] getAllRequests exception:', err);
    return { data: [], error: err };
  }
}

/**
 * Updates an admin user's role between 'Administrator' and 'Editor'.
 */
export async function updateAdminUserRole(userId, newRole) {
  if (!userId || !newRole) return { error: new Error('Missing userId or newRole') };

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .update({ role: newRole })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('[AuthService] updateAdminUserRole error:', error);
      return { data: null, error };
    }

    return { data: normalizeAdminUser(data), error: null };
  } catch (err) {
    console.error('[AuthService] updateAdminUserRole exception:', err);
    return { data: null, error: err };
  }
}

/**
 * Deletes / Revokes an admin user from public.admin_users.
 */
export async function deleteAdminUser(userId) {
  if (!userId) return { error: new Error('Missing userId') };

  try {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('[AuthService] deleteAdminUser error:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('[AuthService] deleteAdminUser exception:', err);
    return { error: err };
  }
}

/**
 * Approves a pending request:
 * 1. Inserts the user into public.admin_users as 'Editor' by default.
 * 2. Updates public.requests status to 'approved'.
 */
export async function approveAccessRequest(request, assignedRole = 'Editor') {
  if (!request?.id) return { error: new Error('Invalid request object') };

  const email = request.email || request.emai;
  if (!email) return { error: new Error('Request has no email') };

  try {
    // 1. Check if user is already in admin_users
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('*')
      .ilike('email', email)
      .maybeSingle();

    let createdAdmin = null;

    if (!existingUser) {
      // Insert new admin user as 'Editor' by default
      const { data: insertedUser, error: insertErr } = await supabase
        .from('admin_users')
        .insert([
          {
            email: email,
            name: request.name || email.split('@')[0],
            role: assignedRole,
            last_active: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (insertErr) {
        console.error('[AuthService] Error creating admin user upon approval:', insertErr);
        return { error: insertErr };
      }
      createdAdmin = insertedUser;
    } else {
      createdAdmin = existingUser;
    }

    // 2. Mark request as approved
    const { error: updateReqErr } = await supabase
      .from('requests')
      .update({ status: 'approved' })
      .eq('id', request.id);

    if (updateReqErr) {
      console.warn('[AuthService] Warning updating request status to approved:', updateReqErr);
    }

    return {
      success: true,
      adminUser: normalizeAdminUser(createdAdmin),
      error: null
    };
  } catch (err) {
    console.error('[AuthService] approveAccessRequest exception:', err);
    return { error: err };
  }
}

/**
 * Rejects a pending request by setting status to 'rejected'.
 */
export async function rejectAccessRequest(requestId) {
  if (!requestId) return { error: new Error('Missing requestId') };

  try {
    const { error } = await supabase
      .from('requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) {
      console.error('[AuthService] rejectAccessRequest error:', error);
      return { error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('[AuthService] rejectAccessRequest exception:', err);
    return { error: err };
  }
}
