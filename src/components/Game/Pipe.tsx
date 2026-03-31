import type { PipeModel } from "../../types";

interface PipeProps {
  pipe: PipeModel;
  worldHeight: number;
  groundHeight: number;
}

const Pipe = ({ pipe, worldHeight, groundHeight }: PipeProps) => {
  const bottomY = pipe.gapY + pipe.gapHeight;
  return (
    <>
      <div
        className="absolute bg-green-600"
        style={{ left: pipe.x, top: 0, width: pipe.width, height: pipe.gapY }}
        aria-hidden="true"
      />
      <div
        className="absolute bg-green-600"
        style={{
          left: pipe.x,
          top: bottomY,
          width: pipe.width,
          height: worldHeight - groundHeight - bottomY,
        }}
        aria-hidden="true"
      />
    </>
  );
};

export default Pipe;
