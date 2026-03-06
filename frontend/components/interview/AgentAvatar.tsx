'use client';

import { useRef, useEffect } from 'react';
import type { AgentState } from '@/types/interview';

interface AgentAvatarProps {
  state: AgentState;
}

export default function AgentAvatar({ state }: AgentAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const dpr = window.devicePixelRatio || 1;
    const size = 220;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const baseRadius = 50;
    let frame = 0;

    function draw() {
      ctx.clearRect(0, 0, size, size);
      frame++;
      const s = stateRef.current;
      const t = frame * 0.02;

      // Outer glow
      const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.5, cx, cy, baseRadius * 2.2);
      const glowIntensity = s === 'speaking' ? 0.25 : s === 'analyzing' ? 0.15 : 0.08;
      glowGrad.addColorStop(0, `rgba(255, 45, 45, ${glowIntensity})`);
      glowGrad.addColorStop(1, 'rgba(255, 45, 45, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, size, size);

      // Rings
      const ringCount = 3;
      for (let i = 0; i < ringCount; i++) {
        const ringRadius = baseRadius + 18 + i * 12;
        const speed = s === 'analyzing' ? 0.015 : s === 'speaking' ? 0.008 : 0.003;
        const rotation = t * speed * (i % 2 === 0 ? 1 : -1) * (i + 1) * 80;
        const alpha = s === 'idle' ? 0.08 : s === 'listening' ? 0.15 : s === 'speaking' ? 0.3 : 0.2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, ringRadius, ringRadius * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 45, 45, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // Main orb with distortions
      const points = 80;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        let r = baseRadius;

        if (s === 'speaking') {
          r += Math.sin(angle * 6 + t * 8) * 8 + Math.sin(angle * 3 + t * 5) * 5 + Math.random() * 3;
        } else if (s === 'listening') {
          r += Math.sin(angle * 4 + t * 2) * 3 + Math.sin(angle * 2 + t) * 2;
        } else if (s === 'analyzing') {
          r += Math.sin(angle * 8 + t * 3) * 4 + Math.cos(angle * 5 + t * 2) * 3;
        } else if (s === 'thinking') {
          r += Math.sin(angle * 3 + t * 1.5) * 5 + Math.cos(angle * 7 + t * 2.5) * 3;
        } else {
          r += Math.sin(angle * 3 + t) * 1.5;
        }

        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Orb gradient fill
      const orbGrad = ctx.createRadialGradient(cx - 15, cy - 15, 5, cx, cy, baseRadius);
      if (s === 'speaking') {
        orbGrad.addColorStop(0, '#FF5555');
        orbGrad.addColorStop(0.7, '#CC1111');
        orbGrad.addColorStop(1, '#880808');
      } else if (s === 'analyzing') {
        orbGrad.addColorStop(0, '#FF4040');
        orbGrad.addColorStop(0.7, '#AA1515');
        orbGrad.addColorStop(1, '#661010');
      } else if (s === 'thinking') {
        orbGrad.addColorStop(0, '#FF3535');
        orbGrad.addColorStop(0.7, '#BB1010');
        orbGrad.addColorStop(1, '#770A0A');
      } else {
        orbGrad.addColorStop(0, '#DD3333');
        orbGrad.addColorStop(0.7, '#991010');
        orbGrad.addColorStop(1, '#550808');
      }
      ctx.fillStyle = orbGrad;
      ctx.fill();

      // Inner shimmer
      const shimmerGrad = ctx.createRadialGradient(cx - 12, cy - 18, 2, cx, cy, baseRadius * 0.8);
      shimmerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      shimmerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shimmerGrad;
      ctx.fill();

      // Eye / core
      const coreSize = s === 'speaking' ? 5 + Math.sin(t * 6) * 2 : s === 'analyzing' ? 4 + Math.sin(t * 3) : 4;
      ctx.beginPath();
      ctx.arc(cx, cy, coreSize, 0, Math.PI * 2);
      ctx.fillStyle = s === 'speaking' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)';
      ctx.fill();

      // Particles (when speaking or analyzing)
      if (s === 'speaking' || s === 'analyzing') {
        const particleCount = s === 'speaking' ? 12 : 6;
        for (let i = 0; i < particleCount; i++) {
          const pAngle = (i / particleCount) * Math.PI * 2 + t * 2;
          const pDist = baseRadius + 25 + Math.sin(t * 3 + i) * 10;
          const px = cx + Math.cos(pAngle) * pDist;
          const py = cy + Math.sin(pAngle) * pDist;
          const pSize = 1 + Math.random() * 1.5;
          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 45, 45, ${0.3 + Math.random() * 0.3})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const stateLabel: Record<AgentState, string> = {
    idle: 'STANDBY',
    listening: 'LISTENING',
    speaking: 'SPEAKING',
    analyzing: 'ANALYZING',
    thinking: 'THINKING',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <canvas ref={canvasRef} className="animate-float" />
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            state === 'speaking'
              ? 'bg-red-primary animate-pulse'
              : state === 'listening'
              ? 'bg-green-terminal animate-pulse'
              : state === 'analyzing' || state === 'thinking'
              ? 'bg-yellow-400 animate-pulse'
              : 'bg-text-dim'
          }`}
        />
        <span className="font-mono text-xs text-text-secondary tracking-widest uppercase">
          {stateLabel[state]}
        </span>
      </div>
    </div>
  );
}
