"use client";

import React, { useEffect, useRef } from 'react';

interface Logo {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

export function ScrollingLogoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let logos: Logo[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createLogo = (): Logo => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 40 + Math.random() * 60,
      opacity: 0.03 + Math.random() * 0.05,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
    });

    const drawFaktixLogo = (x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity;
      
              // Simple faktix logo representation
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(-size/2, -size/2, size, size * 0.8);
      ctx.stroke();
      
      // Add some lines inside
      ctx.beginPath();
      ctx.moveTo(-size/4, -size/4);
      ctx.lineTo(size/4, -size/4);
      ctx.moveTo(-size/4, 0);
      ctx.lineTo(size/6, 0);
      ctx.stroke();
      
      ctx.restore();
    };

    const initLogos = () => {
      logos = [];
      const logoCount = Math.floor(window.innerWidth / 150);
      for (let i = 0; i < logoCount; i++) {
        logos.push(createLogo());
      }
    };

    const updateLogos = () => {
      logos.forEach(logo => {
        logo.x += logo.vx;
        logo.y += logo.vy;
        logo.rotation += logo.rotationSpeed;

        // Wrap around edges
        if (logo.x < -100) logo.x = window.innerWidth + 100;
        if (logo.x > window.innerWidth + 100) logo.x = -100;
        if (logo.y < -100) logo.y = window.innerHeight + 100;
        if (logo.y > window.innerHeight + 100) logo.y = -100;
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      logos.forEach(logo => {
        drawFaktixLogo(logo.x, logo.y, logo.size, logo.rotation, logo.opacity);
      });
    };

    const animate = () => {
      updateLogos();
      draw();
      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      initLogos();
    };

    // Initialize
    resizeCanvas();
    initLogos();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
    />
  );
} 