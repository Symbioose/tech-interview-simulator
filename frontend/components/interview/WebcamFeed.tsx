'use client';

import { useRef, useEffect, useCallback } from 'react';

interface WebcamFeedProps {
  onFrameCapture?: (imageData: string) => void;
}

export default function WebcamFeed({ onFrameCapture }: WebcamFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        // Camera already permitted from setup; silently fail
      }
    }
    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Frame sampling for backend (every 2s)
  const startCapture = useCallback(() => {
    if (!onFrameCapture) return;
    intervalRef.current = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, 320, 240);
      onFrameCapture(canvas.toDataURL('image/jpeg', 0.6));
    }, 2000);
  }, [onFrameCapture]);

  useEffect(() => {
    startCapture();
  }, [startCapture]);

  return (
    <div className="relative rounded overflow-hidden border border-border-primary bg-bg-tertiary">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full aspect-[4/3] object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute top-2 left-2 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-red-primary animate-pulse" />
        <span className="font-mono text-[9px] text-red-primary/80 uppercase tracking-wider">Live</span>
      </div>
    </div>
  );
}
