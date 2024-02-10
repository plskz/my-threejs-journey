import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Model } from "./Model";

export default function Experience() {
  return (
    <>
      <color args={["#241a1a"]} attach="background" />
      <Environment preset="city" />

      <OrbitControls makeDefault />

      <Float rotationIntensity={0.4}>
        <Model />
      </Float>
    </>
  );
}
