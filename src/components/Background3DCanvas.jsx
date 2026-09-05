import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ============================================================================
// BACKGROUND 3D CANVAS COMPONENT (Three.js WebGL)
// ============================================================================
// Renders an interactive 3D WebGL cyber particle field, rotating geometric wireframes,
// and dynamic light vectors behind the Technospark website content.
// Reacts smoothly to mouse movement parallax and scroll position.
// ============================================================================

export default function Background3DCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 1. PARTICLE MATRIX (3D Starfield / Cyber Dust)
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    const cyan = new THREE.Color('#00F0FF');
    const blue = new THREE.Color('#3B82F6');
    const purple = new THREE.Color('#A855F7');

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 80;
      posArray[i + 1] = (Math.random() - 0.5) * 80;
      posArray[i + 2] = (Math.random() - 0.5) * 50;

      // Color variation
      const mixedColor = cyan.clone();
      const rand = Math.random();
      if (rand > 0.6) mixedColor.lerp(purple, Math.random());
      else if (rand > 0.3) mixedColor.lerp(blue, Math.random());

      colorArray[i] = mixedColor.r;
      colorArray[i + 1] = mixedColor.g;
      colorArray[i + 2] = mixedColor.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    // Custom Canvas Texture for glowing circular particles
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const ctx = particleCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(0,240,255,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const pTexture = new THREE.CanvasTexture(particleCanvas);

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.8,
      map: pTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 2. CENTRAL GEOMETRIC CYBER WIREFRAME (Icosahedron & Rings)
    const wireframeGroup = new THREE.Group();

    // Outer Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(7, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    wireframeGroup.add(icoMesh);

    // Inner Torus Ring
    const torusGeo = new THREE.TorusGeometry(10, 0.08, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x3B82F6,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 3;
    wireframeGroup.add(torusMesh);

    // Tilted Ring
    const torusGeo2 = new THREE.TorusGeometry(12, 0.05, 12, 80);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: 0xA855F7,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const torusMesh2 = new THREE.Mesh(torusGeo2, torusMat2);
    torusMesh2.rotation.y = Math.PI / 4;
    wireframeGroup.add(torusMesh2);

    wireframeGroup.position.set(12, 2, -5);
    scene.add(wireframeGroup);

    // 3. FLOATING TECH NODES (Small octahedrons in 3D space)
    const nodesGroup = new THREE.Group();
    const nodeGeo = new THREE.OctahedronGeometry(0.7, 0);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    for (let i = 0; i < 15; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20
      );
      node.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      nodesGroup.add(node);
    }
    scene.add(nodesGroup);

    // Mouse Tracking State
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Rotate particle field
      particlesMesh.rotation.y = elapsedTime * 0.03 + mouseX * 0.2;
      particlesMesh.rotation.x = elapsedTime * 0.02 + mouseY * 0.2;

      // Rotate main geometric group
      icoMesh.rotation.x = elapsedTime * 0.15;
      icoMesh.rotation.y = elapsedTime * 0.2;
      torusMesh.rotation.z = elapsedTime * 0.1;
      torusMesh2.rotation.x = elapsedTime * -0.12;

      // Nodes animation
      nodesGroup.children.forEach((node, idx) => {
        node.rotation.x += 0.01;
        node.rotation.y += 0.015;
        node.position.y += Math.sin(elapsedTime + idx) * 0.005;
      });

      // Scroll reactive positioning & rotation
      const scrollFactor = scrollY * 0.002;
      wireframeGroup.position.y = 2 - scrollFactor * 3;
      wireframeGroup.rotation.y = scrollFactor * 2 + mouseX * 0.5;

      // Camera micro-movement
      camera.position.x = mouseX * 2;
      camera.position.y = -mouseY * 2;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      torusGeo2.dispose();
      torusMat2.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="webgl-background-canvas"
      aria-hidden="true"
    />
  );
}
