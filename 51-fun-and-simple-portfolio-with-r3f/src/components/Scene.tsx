import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";

export default function Scene() {
  return (
    <Canvas
      className="touch-none"
      camera={{
        fov: 45,
        near: 0.1,
        far: 2000,
        position: [-3, 1.5, 4],
      }}
    >
      <Experience />
    </Canvas>
  );
}
