import { Center, OrbitControls } from "@react-three/drei";
import { Model } from "./Model";

export default function Experience() {
  return (
    <>
      <color args={["#241a1a"]} attach="background" />

      <OrbitControls makeDefault />

      <Center>
        <Model />
      </Center>
    </>
  );
}
