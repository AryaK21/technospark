import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// ============================================================================
// 3D GLOBE SCENE COMPONENT (Spider-Verse Comic & Multiverse Edition)
// ============================================================================
// Features:
// 1. Off-Register Chromatic Wireframe Cages (Cyan & Spider-Red print split)
// 2. Custom GLSL Spider-Verse Planet Shader (Stepped cel-shading, Ben-Day
//    halftone dots, diagonal comic-ink hatching, and chromatic rim lighting)
// 3. Hand-Inked Black Comic Silhouette Outline Shell
// 4. Multiverse Portal City Nodes (Comic diamond/star sprites in theme palette)
// 5. Segmented Comic-Book Dimensional Rings with Ink Borders
// 6. Kirby Krackle Satellites (Black ink cores + off-register neon halos)
// 7. "Animated on Twos" (12 FPS stepped comic motion)
// ============================================================================

export default function GlobeScene({ onGlobeClick }) {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    let width = container.clientWidth || 740;
    let height = container.clientHeight || 740;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.overflow = 'visible';
    renderer.domElement.style.outline = 'none';
    container.appendChild(renderer.domElement);

    // Main Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const sphereRadius = 1.6;

    // 0. Hand-Inked Black Comic Outer Silhouette Shell (Inverted Hull Outline)
    const inkOutlineGeo = new THREE.SphereGeometry(sphereRadius * 1.038, 40, 40);
    const inkOutlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    });
    const inkOutlineMesh = new THREE.Mesh(inkOutlineGeo, inkOutlineMat);
    globeGroup.add(inkOutlineMesh);

    // 1. Off-Register Chromatic Wireframe Grid (Cyan & Spider-Red Comic Print Split)
    const sphereGeo = new THREE.IcosahedronGeometry(sphereRadius * 1.006, 3);
    const wireframeGeo = new THREE.EdgesGeometry(sphereGeo, 12);

    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff, // Cyber Cyan
      transparent: true,
      opacity: 0.52
    });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    globeGroup.add(wireframe);

    // Off-register Spider-Red chromatic aberration wireframe double
    const redWireframeMat = new THREE.LineBasicMaterial({
      color: 0xf43f5e, // Spider-Red / Hot Pink
      transparent: true,
      opacity: 0.42
    });
    const redWireframe = new THREE.LineSegments(wireframeGeo, redWireframeMat);
    redWireframe.position.set(0.026, -0.016, 0);
    globeGroup.add(redWireframe);

    // 2. Inner Sphere with Spider-Verse Cel-Shading, Ben-Day Halftone & Comic Ink Hatching
    const innerGeo = new THREE.SphereGeometry(sphereRadius * 0.99, 64, 64);
    const innerMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uLightDir: { value: new THREE.Vector3(0.75, 0.45, 0.85).normalize() },
        uDarkVoid: { value: new THREE.Color(0x070412) },
        uDeepIndigo: { value: new THREE.Color(0x190b33) },
        uNeonPurple: { value: new THREE.Color(0xa855f7) },
        uCyberCyan: { value: new THREE.Color(0x00f0ff) },
        uSpiderRed: { value: new THREE.Color(0xf43f5e) },
        uCyberAmber: { value: new THREE.Color(0xf59e0b) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec2 vUv;
        varying vec3 vObjPos;

        void main() {
          vUv = uv;
          vObjPos = position;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uLightDir;
        uniform vec3 uDarkVoid;
        uniform vec3 uDeepIndigo;
        uniform vec3 uNeonPurple;
        uniform vec3 uCyberCyan;
        uniform vec3 uSpiderRed;
        uniform vec3 uCyberAmber;

        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec2 vUv;
        varying vec3 vObjPos;

        // 2D rotation helper for Ben-Day halftone screens & comic hatching
        vec2 rotate2D(vec2 p, float angle) {
          float s = sin(angle);
          float c = cos(angle);
          return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
        }

        // Ben-Day halftone dot function
        float halftone(vec2 uv, float scale, float angle, float radius) {
          vec2 ruv = rotate2D(uv * scale, angle);
          vec2 grid = fract(ruv) - 0.5;
          return 1.0 - smoothstep(radius - 0.06, radius + 0.06, length(grid));
        }

        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vViewPosition);
          float NdotL = dot(N, uLightDir);
          float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.4);

          // Procedural stylized continent/multiverse energy bands
          float continentWave = sin(vObjPos.x * 3.4 + cos(vObjPos.y * 4.2))
                              * cos(vObjPos.z * 3.6 - sin(vObjPos.x * 2.8));
          float isContinent = step(0.08, continentWave);

          // 3-band Posterized Comic Cel-Shading
          vec3 baseCol = uDarkVoid;
          if (NdotL > 0.42) {
            baseCol = mix(uDeepIndigo, uNeonPurple, 0.58);
          } else if (NdotL > -0.08) {
            baseCol = uDeepIndigo;
          }

          // Highlighted cyber continents with hard comic ink edge
          if (isContinent > 0.5) {
            float edge = smoothstep(0.08, 0.13, continentWave);
            vec3 contCol = (NdotL > 0.15) ? mix(uDeepIndigo, uCyberCyan, 0.38) : mix(uDarkVoid, uNeonPurple, 0.28);
            baseCol = mix(vec3(0.0), contCol, edge);
          }

          // Ben-Day Halftone Dots in lit zones (Cyan & Spider-Red rotated dot matrices)
          vec2 sphereCoord = vec2(atan(vObjPos.z, vObjPos.x), acos(clamp(vObjPos.y / 1.6, -1.0, 1.0)));
          float cyanDotRadius = clamp((NdotL - 0.05) * 0.62, 0.0, 0.46);
          float cyanDots = halftone(sphereCoord, 18.0, 0.26, cyanDotRadius) * step(0.05, NdotL);
          baseCol = mix(baseCol, uCyberCyan, cyanDots * 0.65);

          float pinkZone = clamp(sin(vObjPos.y * 2.6 + uTime * 1.5) * 0.5 + 0.5, 0.0, 1.0);
          float redDotRadius = clamp((NdotL + 0.2) * 0.48 * pinkZone, 0.0, 0.42);
          float redDots = halftone(sphereCoord, 15.0, 0.78, redDotRadius) * step(-0.15, NdotL);
          baseCol = mix(baseCol, uSpiderRed, redDots * 0.55);

          // Diagonal Comic-Ink Cross-Hatching in the shadow terminator band
          if (NdotL < 0.08 && NdotL > -0.45) {
            vec2 hatchUv = rotate2D(sphereCoord * 42.0, -0.55);
            float hatchLine = step(0.62, fract(hatchUv.x));
            baseCol = mix(baseCol, vec3(0.0), hatchLine * 0.72);
          }

          // Deep comic ink shadow ink-black floor
          if (NdotL <= -0.45) {
            vec2 deepHatch = rotate2D(sphereCoord * 36.0, 0.65);
            float crossLine = step(0.45, fract(deepHatch.x));
            baseCol = mix(baseCol * 0.4, vec3(0.0), crossLine * 0.85);
          }

          // Off-Register Split Rim Lighting (Left = Cyber Cyan, Right = Spider Red, Top = Amber)
          float leftRim = smoothstep(0.45, 0.88, fresnel * max(-N.x + 0.25, 0.0));
          float rightRim = smoothstep(0.45, 0.88, fresnel * max(N.x + 0.25, 0.0));
          float topRim = smoothstep(0.62, 0.92, fresnel * max(N.y, 0.0));

          baseCol = mix(baseCol, uCyberCyan, leftRim * 0.92);
          baseCol = mix(baseCol, uSpiderRed, rightRim * 0.92);
          baseCol = mix(baseCol, uCyberAmber, topRim * 0.55);

          // Outer grazing ink line
          float inkEdge = smoothstep(0.84, 0.96, fresnel);
          baseCol = mix(baseCol, vec3(0.0), inkEdge * 0.9);

          gl_FragColor = vec4(baseCol, 1.0);
        }
      `
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerSphere);

    // 3. Surface Comic Star / Multiverse Portal Nodes (Diamond Comic Sprites)
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const sCtx = spriteCanvas.getContext('2d');
    sCtx.fillStyle = '#000000';
    sCtx.beginPath();
    sCtx.moveTo(32, 2);
    sCtx.lineTo(42, 22);
    sCtx.lineTo(62, 32);
    sCtx.lineTo(42, 42);
    sCtx.lineTo(32, 62);
    sCtx.lineTo(22, 42);
    sCtx.lineTo(2, 32);
    sCtx.lineTo(22, 22);
    sCtx.closePath();
    sCtx.fill();

    sCtx.fillStyle = '#FFFFFF';
    sCtx.beginPath();
    sCtx.moveTo(32, 8);
    sCtx.lineTo(39, 25);
    sCtx.lineTo(56, 32);
    sCtx.lineTo(39, 39);
    sCtx.lineTo(32, 56);
    sCtx.lineTo(25, 39);
    sCtx.lineTo(8, 32);
    sCtx.lineTo(25, 25);
    sCtx.closePath();
    sCtx.fill();
    const starTexture = new THREE.CanvasTexture(spriteCanvas);

    const nodeCount = 190;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);

    const paletteColors = [
      new THREE.Color(0x00f0ff), // Cyber Cyan
      new THREE.Color(0xf43f5e), // Spider Red
      new THREE.Color(0xa855f7), // Neon Purple
      new THREE.Color(0xf59e0b)  // Cyber Amber
    ];

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const r = sphereRadius + 0.045;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;

      const c = paletteColors[i % paletteColors.length];
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

    const nodeMat = new THREE.PointsMaterial({
      size: 0.11,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.15,
      opacity: 0.95
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    globeGroup.add(nodes);

    // 4. Stepped Halftone Aura Ring Behind the Globe
    const glowGeo = new THREE.SphereGeometry(sphereRadius * 1.14, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.11,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const glowSphere = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowSphere);

    // 5. Segmented Comic-Book Dimensional Rings (Surrounding the Globe)
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const ringCanvas = document.createElement('canvas');
    ringCanvas.width = 512;
    ringCanvas.height = 32;
    const rCtx = ringCanvas.getContext('2d');
    for (let x = 0; x < 512; x += 32) {
      rCtx.fillStyle = '#000000';
      rCtx.fillRect(x, 0, 24, 32);
      rCtx.fillStyle = '#FFFFFF';
      rCtx.fillRect(x + 2, 6, 20, 20);
    }
    const ringDashTex = new THREE.CanvasTexture(ringCanvas);
    ringDashTex.wrapS = THREE.RepeatWrapping;
    ringDashTex.wrapT = THREE.ClampToEdgeWrapping;
    ringDashTex.repeat.set(6, 1);

    // Primary Dimensional Ring (Spider-Red / Magenta)
    const ringRadius = sphereRadius * 1.62;
    const ringGeo = new THREE.RingGeometry(ringRadius - 0.032, ringRadius + 0.032, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      map: ringDashTex,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const primaryRing = new THREE.Mesh(ringGeo, ringMat);
    primaryRing.rotation.x = Math.PI / 2.3;
    primaryRing.rotation.y = -Math.PI / 6;
    ringGroup.add(primaryRing);

    // Secondary Outer Dimensional Ring (Cyber Cyan)
    const outerRingRadius = sphereRadius * 1.95;
    const outerRingGeo = new THREE.RingGeometry(outerRingRadius - 0.026, outerRingRadius + 0.026, 96);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      map: ringDashTex,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 1.9;
    outerRing.rotation.y = Math.PI / 4.5;
    ringGroup.add(outerRing);

    // Third Off-Register Comic Ink / Cyber Amber Ring
    const midRingRadius = sphereRadius * 1.78;
    const midRingGeo = new THREE.RingGeometry(midRingRadius - 0.016, midRingRadius + 0.016, 72);
    const midRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      map: ringDashTex,
      transparent: true,
      opacity: 0.58,
      side: THREE.DoubleSide
    });
    const midRing = new THREE.Mesh(midRingGeo, midRingMat);
    midRing.rotation.x = Math.PI / 2.1;
    midRing.rotation.y = Math.PI / 9;
    ringGroup.add(midRing);

    // 6. Kirby Krackle Satellites (Black Comic Ink Spheres with Neon Offset Halos)
    const satCount = 6;
    const satellites = [];
    const satGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const satHaloGeo = new THREE.SphereGeometry(0.078, 16, 16);
    const satInkMat = new THREE.MeshBasicMaterial({ color: 0x05030a });
    const satHaloMats = [];

    const satColors = [0x00f0ff, 0xf43f5e, 0xa855f7, 0xf59e0b, 0x00f0ff, 0xf43f5e];

    for (let i = 0; i < satCount; i++) {
      const satGroup = new THREE.Group();

      const coreMesh = new THREE.Mesh(satGeo, satInkMat);
      satGroup.add(coreMesh);

      const haloMat = new THREE.MeshBasicMaterial({
        color: satColors[i],
        side: THREE.BackSide
      });
      satHaloMats.push(haloMat);
      const haloMesh = new THREE.Mesh(satHaloGeo, haloMat);
      haloMesh.position.set(0.018, 0.012, -0.01);
      satGroup.add(haloMesh);

      scene.add(satGroup);
      satellites.push({
        mesh: satGroup,
        radius: i % 3 === 0 ? ringRadius : i % 3 === 1 ? outerRingRadius : midRingRadius,
        speed: (0.55 + i * 0.16) * (i % 2 === 0 ? 1 : -1),
        offset: (i * Math.PI) / 3,
        inclination: i % 3 === 0 ? Math.PI / 2.3 : i % 3 === 1 ? Math.PI / 1.9 : Math.PI / 2.1,
        rotationY: i % 3 === 0 ? -Math.PI / 6 : i % 3 === 1 ? Math.PI / 4.5 : Math.PI / 9
      });
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xc084fc, 2.2);
    dirLight1.position.set(5, 3, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00f0ff, 1.4);
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    // Mouse Interaction Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.38;
      mouseY = y * 0.28;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler with ResizeObserver
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(container);
    }

    // Animation Loop — Smooth Continuous Motion
    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      innerMat.uniforms.uTime.value = elapsed;

      // Smooth continuous globe rotation
      globeGroup.rotation.y = elapsed * 0.24;
      globeGroup.rotation.z = 0;

      // Smooth counter-rotation on dimensional comic rings
      primaryRing.rotation.z = elapsed * 0.32;
      outerRing.rotation.z = -elapsed * 0.22;
      midRing.rotation.z = elapsed * 0.15;

      // Mouse responsive interpolation
      targetRotationY += (mouseX - targetRotationY) * 0.06;
      targetRotationX += (mouseY - targetRotationX) * 0.06;

      globeGroup.rotation.x = 0.2 + targetRotationX * 0.35;
      globeGroup.position.x = targetRotationY * 0.2;

      // Animate Kirby Krackle satellites smoothly
      satellites.forEach((sat) => {
        const angle = elapsed * sat.speed + sat.offset;
        const localX = sat.radius * Math.cos(angle);
        const localY = sat.radius * Math.sin(angle);

        const pos = new THREE.Vector3(localX, localY, 0);
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), sat.inclination);
        pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), sat.rotationY);

        sat.mesh.position.copy(pos);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      inkOutlineGeo.dispose();
      inkOutlineMat.dispose();
      sphereGeo.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      redWireframeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      starTexture.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      ringDashTex.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      midRingGeo.dispose();
      midRingMat.dispose();
      satGeo.dispose();
      satHaloGeo.dispose();
      satInkMat.dispose();
      satHaloMats.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  if (!webglSupported) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          minHeight: '420px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 32% 32%, #00f0ff 0%, #a855f7 38%, #190b33 70%, #050813 100%)',
            boxShadow: '6px 6px 0px #000000, -4px -2px 0px #00f0ff, 5px 4px 0px #f43f5e',
            border: '4px solid #000000',
            position: 'relative'
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="globe-scene-mount"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab'
      }}
      title="Interactive TechnoSpark Cosmic Globe — Drag or hover to explore"
      onClick={onGlobeClick}
    />
  );
}

export { GlobeScene };
