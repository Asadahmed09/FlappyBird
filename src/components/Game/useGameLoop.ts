import { useEffect, useRef } from 'react';

export const useGameLoop = (onFrame: (dtMs: number) => void, enabled: boolean) => {
  const lastTimestampRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
      lastTimestampRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const dtMs = Math.min(48, timestamp - lastTimestampRef.current);
      lastTimestampRef.current = timestamp;
      onFrame(dtMs);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
      lastTimestampRef.current = null;
    };
  }, [enabled, onFrame]);
};
