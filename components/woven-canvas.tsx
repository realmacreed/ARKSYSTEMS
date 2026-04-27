"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

export function WovenCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const w = window.innerWidth, h = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.cssText = "display:block;position:absolute;top:0;left:0;width:100%;height:100%;";
    container.appendChild(renderer.domElement);

    let mouseX = 0, mouseY = 0;
    const clock = new THREE.Clock();

    const particleCount = 30000;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const geometry = new THREE.BufferGeometry();
    const torusKnot = new THREE.TorusKnotGeometry(2.8, 0.9, 300, 48);
    const srcPos = torusKnot.attributes.position;

    const palette = [
      new THREE.Color("#001a33"),
      new THREE.Color("#003366"),
      new THREE.Color("#0ea5e9"),
      new THREE.Color("#38bdf8"),
      new THREE.Color("#0066aa"),
    ];

    for (let i = 0; i < particleCount; i++) {
      const vi = i % srcPos.count;
      const spread = 0.18;
      const x = srcPos.getX(vi) + (Math.random() - 0.5) * spread;
      const y = srcPos.getY(vi) + (Math.random() - 0.5) * spread;
      const z = srcPos.getZ(vi) + (Math.random() - 0.5) * spread;
      positions[i * 3] = originalPositions[i * 3] = x;
      positions[i * 3 + 1] = originalPositions[i * 3 + 1] = y;
      positions[i * 3 + 2] = originalPositions[i * 3 + 2] = z;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.028,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    torusKnot.dispose();

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    const INTERACT_R2 = 1.5 * 1.5;
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const t = clock.getElapsedTime();
      const mx = mouseX * 3, my = mouseY * 3;
      let dirty = false;

      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2;
        const px = positions[ix], py = positions[iy], pz = positions[iz];
        let vx = velocities[ix], vy = velocities[iy], vz = velocities[iz];

        const dx = px - mx, dy = py - my;
        const distSq = dx * dx + dy * dy;
        if (distSq < INTERACT_R2 && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (1.5 - dist) * 0.01 / dist;
          vx += dx * force; vy += dy * force;
        }

        vx += (originalPositions[ix] - px) * 0.001;
        vy += (originalPositions[iy] - py) * 0.001;
        vz += (originalPositions[iz] - pz) * 0.001;

        vx *= 0.95; vy *= 0.95; vz *= 0.95;

        if (Math.abs(vx) > 1e-5 || Math.abs(vy) > 1e-5 || Math.abs(vz) > 1e-5) {
          positions[ix] = px + vx;
          positions[iy] = py + vy;
          positions[iz] = pz + vz;
          velocities[ix] = vx; velocities[iy] = vy; velocities[iz] = vz;
          dirty = true;
        }
      }

      if (dirty) geometry.attributes.position.needsUpdate = true;
      points.rotation.y = t * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
