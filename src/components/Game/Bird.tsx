import type { BirdModel } from "../../types";

interface BirdProps {
  bird: BirdModel;
}

const Bird = ({ bird }: BirdProps) => {
  return (
    <div
      className="pointer-events-none absolute rounded-md bg-yellow-300 shadow"
      style={{
        left: `${bird.x}px`,
        top: `${bird.y}px`,
        width: `${bird.width}px`,
        height: `${bird.height}px`,
        transform: `rotate(${bird.rotation}deg)`,
      }}
      aria-hidden="true"
    />
  );
};

export default Bird;
