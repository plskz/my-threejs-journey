import { OrbitControls, Sky, useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import * as THREE from "three";

export default function MySky() {
  const directionalLight = useRef<THREE.DirectionalLight>(null!);
  useHelper(directionalLight, THREE.DirectionalLightHelper, 2);

  const cube = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  return (
    <>
      <color attach="background" args={["skyblue"]} />

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight
        ref={directionalLight}
        position={sunPosition}
        intensity={4.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <ambientLight intensity={1.5} />

      <Sky sunPosition={sunPosition} />

      <mesh castShadow position={[-2, 1, 0]}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow ref={cube} position={[2, 1, 0]} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={0} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
