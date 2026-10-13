import React, { useRef, useEffect } from 'react';
import { audioEngine } from '../../services/audioEngine';
import { VisualizerMode, AccentColor } from '../../types';

interface VisualizerCanvasProps {
  mode: VisualizerMode;
  accentColor: AccentColor;
  className?: string;
  isPlaying: boolean;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({
  mode,
  accentColor,
  className = '',
  isPlaying,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const bufferLength = 64;
    const freqData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    const getAccentColors = (alpha: number = 1): { primary: string; secondary: string } => {
      switch (accentColor) {
        case 'violet':
          return { primary: `rgba(168, 85, 247, ${alpha})`, secondary: `rgba(139, 92, 246, ${alpha})` };
        case 'amber':
          return { primary: `rgba(245, 158, 11, ${alpha})`, secondary: `rgba(251, 191, 36, ${alpha})` };
        case 'rose':
          return { primary: `rgba(244, 63, 94, ${alpha})`, secondary: `rgba(251, 113, 133, ${alpha})` };
        case 'cyan':
          return { primary: `rgba(6, 182, 212, ${alpha})`, secondary: `rgba(56, 189, 248, ${alpha})` };
        case 'emerald':
        default:
          return { primary: `rgba(16, 185, 129, ${alpha})`, secondary: `rgba(52, 211, 153, ${alpha})` };
      }
    };

    const render = () => {
      animId = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        audioEngine.getFrequencyData(freqData);
        audioEngine.getTimeDomainData(timeData);
      } else {
        // Idle gentle breathing baseline
        freqData.fill(12);
        timeData.fill(128);
      }

      const { primary, secondary } = getAccentColors(0.85);

      if (mode === 'bars') {
        const barWidth = (width / bufferLength) * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const val = freqData[i];
          const barHeight = Math.max(4, (val / 255) * height * 0.9);

          const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
          grad.addColorStop(0, primary);
          grad.addColorStop(1, secondary);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight, Math.max(2, barWidth - 3), barHeight, [3, 3, 0, 0]);
          ctx.fill();

          x += barWidth;
        }
      } else if (mode === 'waves') {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = primary;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.stroke();
      } else if (mode === 'circular') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) * 0.55;

        ctx.save();
        ctx.translate(centerX, centerY);

        const barsCount = 36;
        for (let i = 0; i < barsCount; i++) {
          const angle = (i * 2 * Math.PI) / barsCount;
          const val = freqData[i % bufferLength] || 20;
          const barLen = Math.max(6, (val / 255) * (radius * 0.8));

          const x1 = Math.cos(angle) * radius;
          const y1 = Math.sin(angle) * radius;
          const x2 = Math.cos(angle) * (radius + barLen);
          const y2 = Math.sin(angle) * (radius + barLen);

          ctx.strokeStyle = i % 2 === 0 ? primary : secondary;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        ctx.restore();
      } else if (mode === 'spectrum') {
        // Area filled neon mountain
        ctx.beginPath();
        ctx.moveTo(0, height);

        const sliceWidth = width / (bufferLength - 1);
        for (let i = 0; i < bufferLength; i++) {
          const val = freqData[i];
          const y = height - (val / 255) * height * 0.85;
          ctx.lineTo(i * sliceWidth, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, getAccentColors(0.45).primary);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fill();

        // Stroke line on top
        ctx.strokeStyle = secondary;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (mode === 'minimal') {
        // Sleek 5 floating pulsing dots
        const dotCount = 7;
        const spacing = width / (dotCount + 1);

        for (let i = 0; i < dotCount; i++) {
          const val = freqData[i * 4] || 30;
          const r = Math.max(3, (val / 255) * 16);
          const cx = spacing * (i + 1);
          const cy = height / 2;

          ctx.fillStyle = i === 3 ? primary : secondary;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [mode, accentColor, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={140}
      className={`w-full h-full block ${className}`}
    />
  );
};
