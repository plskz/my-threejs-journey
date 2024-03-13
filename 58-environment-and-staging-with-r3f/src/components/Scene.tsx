import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import MyStage from "./MyStage";
import MySky from "./MySky";

export default function Scene() {
  return (
    <Canvas
      shadows={false}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-8, 6, 12],
      }}
    >
      {/* <Experience /> */}
      {/* <MySky /> */}
      <MyStage />
    </Canvas>
  );
}
