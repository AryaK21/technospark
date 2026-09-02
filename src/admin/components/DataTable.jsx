import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

// ============================================================================
// ADMIN REUSABLE DATA TABLE COMPONENT
// ============================================================================
// Clean, responsive table component featuring:
// - Search filter across columns
// - Optional select dropdown filter
// - Client-side pagination
// - Empty state presentation
//
// Props:
// - columns: Array of { key, label, render: (row) => JSX, align: 'left' | 'right' }
// - data: Array of item objects
// - searchKey: Key in object to search against (or function)
// - searchPlaceholder: Placeholder text for search bar
// - filterOptions: Array of { value, label } for dropdown filter
// - filterKey: Key to filter against
// - itemsPerPage: Number of rows per page (default: 8)
// - emptyMessage: Custom message when no records match
// ============================================================================

export default function DataTable({
  columns = [],
  data = [],
  searchKey = 'title',
  searchPlaceholder = 'Search records...',
  filterOptions = null,
  filterKey = null,
  itemsPerPage = 8,
  emptyMessage = 'No records found.'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search matching
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (typeof searchKey === 'function') {
          matchesSearch = searchKey(item, query);
        } else {
          const val = item[searchKey];
          matchesSearch = val ? String(val).toLowerCase().includes(query) : false;
        }
      }

      // Dropdown filter matching
      let matchesFilter = true;
      if (filterKey && selectedFilter !== 'ALL') {
        matchesFilter = String(item[filterKey]).toLowerCase() === selectedFilter.toLowerCase();
      }

      return matchesSearch && matchesFilter;
    });
  }, [data, searchQuery, searchKey, selectedFilter, filterKey]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="admin-table-wrapper">
      {/* Toolbar */}
      <div className="admin-table-toolbar">
        <div className="admin-table-search">
          <Search size={16} color="var(--admin-text-faint)" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {filterOptions && filterOptions.length > 0 && (
          <div className="admin-table-filters">
            <select
              className="admin-select-filter"
              value={selectedFilter}
              onChange={(e) => {
                setSelectedFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Categories / Statuses</option>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table Content */}
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ textAlign: col.align || 'left', width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{ textAlign: col.align || 'left' }}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="admin-table-empty">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Inbox size={36} color="var(--admin-text-faint)" />
                  <div>{emptyMessage}</div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      {filteredData.length > itemsPerPage && (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid var(--admin-border-subtle)',
            fontSize: '0.82rem',
            color: 'var(--admin-text-muted)'
          }}
        >
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
            {filteredData.length} records
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="admin-btn-icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{ opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 600, color: 'var(--admin-text-title)' }}>
              {currentPage} / {totalPages}
            </span>
            <button
              className="admin-btn-icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{ opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              aria-label="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
