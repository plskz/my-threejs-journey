import { OrbitControls, Stage, useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import * as THREE from "three";

export default function MyStage() {
  const directionalLight = useRef<THREE.DirectionalLight>(null!);
  useHelper(directionalLight, THREE.DirectionalLightHelper, 2);

  const cube = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  const { envMapIntensity } = useControls("environment map", {
    envMapIntensity: { value: 3.5, min: 0, max: 12 },
  });

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <Stage
        shadows={{ type: "contact", opacity: 0.2, blur: 3 }}
        environment="sunset"
        preset="portrait"
        intensity={6}
      >
        <mesh castShadow position={[-2, 1, 0]}>
          <sphereGeometry />
          <meshStandardMaterial
            color="orange"
            envMapIntensity={envMapIntensity}
          />
        </mesh>
        <mesh castShadow ref={cube} position={[2, 1, 0]} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial
            color="mediumpurple"
            envMapIntensity={envMapIntensity}
          />
        </mesh>
      </Stage>
    </>
  );
}
