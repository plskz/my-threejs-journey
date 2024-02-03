"use client";

import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Leva } from "leva";

export default function Scene() {
  return (
    <>
      <Leva collapsed />
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        <Experience />
      </Canvas>
    </>
  );
}
