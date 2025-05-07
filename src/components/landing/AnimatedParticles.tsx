'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const NUM_PARTICLES = 50;

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  opacity: number;
}

export default function AnimatedParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initializeParticles = () => {
      particlesRef.current = [];
      const colors = [
        'hsla(var(--primary) / 0.6)',
        'hsla(var(--secondary) / 0.6)',
        'hsla(var(--accent) / 0.5)',
        'hsla(var(--muted-foreground) / 0.4)',
      ];
      for (let i = 0; i < NUM_PARTICLES; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const drawParticles = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(')', `, ${p.opacity})`); // Apply dynamic opacity
        ctx.fill();
      });
    };

    const updateParticles = () => {
      if (!canvas) return;
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // GSAP powered smooth fade in for canvas
    gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out' });


    window.addEventListener('resize', () => {
      resizeCanvas();
      initializeParticles(); // Re-initialize on resize to fit new dimensions
    });

    resizeCanvas();
    initializeParticles();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" data-ai-hint="background animation" />;
}
