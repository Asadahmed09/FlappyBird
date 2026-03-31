import { useEffect, useRef } from "react";
import type { GameSnapshot } from "../../types";

interface GameCanvasProps {
  snapshot: GameSnapshot;
  onAction: () => void;
}

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const drawTruckArtBorder = (
  ctx: CanvasRenderingContext2D,
  width: number,
  y: number,
) => {
  for (let x = -20; x < width + 20; x += 24) {
    ctx.fillStyle = "#f97316";
    drawRoundedRect(ctx, x, y, 14, 10, 3);
    ctx.fill();

    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(x + 18, y + 5, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 2);
    ctx.lineTo(x + 12, y + 5);
    ctx.lineTo(x + 8, y + 8);
    ctx.lineTo(x + 4, y + 5);
    ctx.closePath();
    ctx.fill();
  }
};

const drawPakistanLandmarks = (
  ctx: CanvasRenderingContext2D,
  width: number,
  skylineY: number,
) => {
  const w = width;

  // Khyber Pass inspired mountain range
  ctx.fillStyle = "#5b1f1f";
  ctx.beginPath();
  ctx.moveTo(0, skylineY);
  ctx.lineTo(w * 0.08, skylineY - 42);
  ctx.lineTo(w * 0.16, skylineY);
  ctx.lineTo(w * 0.24, skylineY - 58);
  ctx.lineTo(w * 0.36, skylineY);
  ctx.lineTo(0, skylineY);
  ctx.closePath();
  ctx.fill();

  // Quaid-e-Azam Tomb inspired dome and base
  const qx = w * 0.42;
  ctx.fillStyle = "#2f0f0f";
  ctx.fillRect(qx - 30, skylineY - 26, 60, 26);
  ctx.beginPath();
  ctx.arc(qx, skylineY - 30, 20, Math.PI, 0);
  ctx.fill();

  // Minar-e-Pakistan inspired tower
  const mx = w * 0.62;
  ctx.fillStyle = "#3d1212";
  ctx.beginPath();
  ctx.moveTo(mx - 10, skylineY);
  ctx.lineTo(mx - 4, skylineY - 64);
  ctx.lineTo(mx + 4, skylineY - 64);
  ctx.lineTo(mx + 10, skylineY);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(mx - 18, skylineY - 6, 36, 6);

  // Ziarat residency inspired structure
  const zx = w * 0.79;
  ctx.fillStyle = "#2a0d0d";
  ctx.fillRect(zx - 36, skylineY - 24, 72, 24);
  ctx.beginPath();
  ctx.moveTo(zx - 44, skylineY - 24);
  ctx.lineTo(zx, skylineY - 42);
  ctx.lineTo(zx + 44, skylineY - 24);
  ctx.closePath();
  ctx.fill();
};

const GameCanvas = ({ snapshot, onAction }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dprRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    dprRef.current = dpr;

    canvas.width = Math.floor(snapshot.world.width * dpr);
    canvas.height = Math.floor(snapshot.world.height * dpr);
    canvas.style.width = `${snapshot.world.width}px`;
    canvas.style.height = `${snapshot.world.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctxRef.current = ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [snapshot.world.width, snapshot.world.height]);

  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) {
      return;
    }

    ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);

    const skyGradient = ctx.createLinearGradient(
      0,
      0,
      0,
      snapshot.world.height,
    );
    skyGradient.addColorStop(0, "#1a0909");
    skyGradient.addColorStop(0.33, "#7f1d1d");
    skyGradient.addColorStop(0.68, "#c2410c");
    skyGradient.addColorStop(1, "#f97316");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, snapshot.world.width, snapshot.world.height);

    const hazeGradient = ctx.createLinearGradient(
      0,
      snapshot.world.height * 0.1,
      0,
      snapshot.world.height * 0.78,
    );
    hazeGradient.addColorStop(0, "rgba(251, 191, 36, 0.05)");
    hazeGradient.addColorStop(1, "rgba(239, 68, 68, 0.18)");
    ctx.fillStyle = hazeGradient;
    ctx.fillRect(0, 0, snapshot.world.width, snapshot.world.height);

    drawTruckArtBorder(ctx, snapshot.world.width, 14);
    drawTruckArtBorder(
      ctx,
      snapshot.world.width,
      snapshot.world.height - snapshot.world.groundHeight - 22,
    );

    ctx.globalAlpha = 0.11;
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath();
      ctx.fillStyle = "#fff7ed";
      ctx.arc(44 + i * 56, 70 + (i % 3) * 22, 22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#ffedd5";
    ctx.beginPath();
    ctx.arc(snapshot.world.width - 74, 76, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7f1d1d";
    ctx.beginPath();
    ctx.arc(snapshot.world.width - 66, 70, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffedd5";
    ctx.beginPath();
    ctx.moveTo(snapshot.world.width - 43, 53);
    ctx.lineTo(snapshot.world.width - 40, 61);
    ctx.lineTo(snapshot.world.width - 32, 61);
    ctx.lineTo(snapshot.world.width - 38, 66);
    ctx.lineTo(snapshot.world.width - 35, 74);
    ctx.lineTo(snapshot.world.width - 43, 70);
    ctx.lineTo(snapshot.world.width - 50, 74);
    ctx.lineTo(snapshot.world.width - 47, 66);
    ctx.lineTo(snapshot.world.width - 53, 61);
    ctx.lineTo(snapshot.world.width - 45, 61);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#2a0f0f";
    const skylineY = snapshot.world.height - snapshot.world.groundHeight - 36;
    ctx.fillRect(0, skylineY, snapshot.world.width, 38);
    drawPakistanLandmarks(ctx, snapshot.world.width, skylineY);
    ctx.fillStyle = "#3f1717";
    for (let i = 0; i < 4; i += 1) {
      const baseX = 40 + i * 92;
      ctx.fillRect(baseX, skylineY - 38, 12, 38);
      ctx.fillRect(baseX + 34, skylineY - 46, 12, 46);
      ctx.beginPath();
      ctx.arc(baseX + 18, skylineY - 15, 18, Math.PI, 0);
      ctx.fill();
    }

    snapshot.pipes.forEach((pipe) => {
      const bottomY = pipe.gapY + pipe.gapHeight;
      const bottomHeight =
        snapshot.world.height - snapshot.world.groundHeight - bottomY;

      const gradient = ctx.createLinearGradient(
        pipe.x,
        0,
        pipe.x + pipe.width,
        0,
      );
      gradient.addColorStop(0, "#7f1d1d");
      gradient.addColorStop(0.5, "#dc2626");
      gradient.addColorStop(1, "#9a3412");
      ctx.fillStyle = gradient;

      drawRoundedRect(ctx, pipe.x, 0, pipe.width, pipe.gapY, 5);
      ctx.fill();

      drawRoundedRect(ctx, pipe.x, bottomY, pipe.width, bottomHeight, 5);
      ctx.fill();

      ctx.fillStyle = "#ffedd5";
      for (let y = 6; y < pipe.gapY - 10; y += 18) {
        ctx.fillRect(pipe.x + 5, y, pipe.width - 10, 3);
      }
      for (let y = bottomY + 6; y < bottomY + bottomHeight - 10; y += 18) {
        ctx.fillRect(pipe.x + 5, y, pipe.width - 10, 3);
      }
    });

    if (snapshot.spicePickup) {
      const pepper = snapshot.spicePickup;
      ctx.save();
      ctx.translate(pepper.x, pepper.y);
      ctx.rotate((pepper.rotation * Math.PI) / 180);
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(-7, -4);
      ctx.quadraticCurveTo(8, -10, 8, 6);
      ctx.quadraticCurveTo(-2, 12, -9, 6);
      ctx.quadraticCurveTo(-10, 0, -7, -4);
      ctx.fill();
      ctx.fillStyle = "#fdba74";
      ctx.fillRect(-2, -9, 4, 5);
      ctx.restore();
    }

    const bird = snapshot.bird;
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate((bird.rotation * Math.PI) / 180);

    ctx.fillStyle = "#facc15";
    drawRoundedRect(
      ctx,
      -bird.width / 2,
      -bird.height / 2,
      bird.width,
      bird.height,
      7,
    );
    ctx.fill();

    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.arc(8, -4, 3, 0, Math.PI * 2);
    ctx.fill();

    if (snapshot.duckFace === "cool") {
      ctx.fillStyle = "#111827";
      drawRoundedRect(ctx, -1, -9, 19, 5, 2);
      ctx.fill();

      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, -8, 6, 3);
      ctx.fillRect(10, -8, 6, 3);
    }

    if (snapshot.duckFace === "angry") {
      ctx.strokeStyle = "#7f1d1d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(3, -8);
      ctx.lineTo(9, -6);
      ctx.moveTo(9, -6);
      ctx.lineTo(13, -8);
      ctx.stroke();
    }

    if (snapshot.duckFace === "classic") {
      ctx.strokeStyle = "#111827";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(3, 3);
      ctx.quadraticCurveTo(8, 6, 13, 3);
      ctx.stroke();
    }

    ctx.fillStyle = "#fb923c";
    drawRoundedRect(ctx, bird.width / 2 - 4, -2, 10, 6, 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "#431407";
    ctx.fillRect(
      0,
      snapshot.world.height - snapshot.world.groundHeight,
      snapshot.world.width,
      snapshot.world.groundHeight,
    );

    ctx.fillStyle = "#ea580c";
    for (let x = 0; x < snapshot.world.width; x += 16) {
      ctx.fillRect(
        x,
        snapshot.world.height - snapshot.world.groundHeight + 8,
        8,
        8,
      );
    }

    if (snapshot.spiceFlashMs > 0) {
      ctx.globalAlpha = Math.min(0.35, snapshot.spiceFlashMs / 1000);
      const heatGradient = ctx.createLinearGradient(
        0,
        0,
        snapshot.world.width,
        snapshot.world.height,
      );
      heatGradient.addColorStop(0, "#fb923c");
      heatGradient.addColorStop(1, "#dc2626");
      ctx.fillStyle = heatGradient;
      ctx.fillRect(
        0,
        0,
        snapshot.world.width,
        snapshot.world.height - snapshot.world.groundHeight,
      );
      ctx.globalAlpha = 1;
    }
  }, [snapshot]);

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full touch-none"
      onClick={onAction}
      onTouchStart={(event) => {
        event.preventDefault();
        onAction();
      }}
      role="button"
      aria-label="Game play area"
      tabIndex={0}
    />
  );
};

export default GameCanvas;
