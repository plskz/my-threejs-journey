import {
  AccumulativeShadows,
  BakeShadows,
  ContactShadows,
  OrbitControls,
  RandomizedLight,
  Sky,
  SoftShadows,
  useHelper,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import * as THREE from "three";

export default function Experience() {
  const directionalLight = useRef<THREE.DirectionalLight>(null!);
  useHelper(directionalLight, THREE.DirectionalLightHelper, 2);

  const cube = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    // const time = state.clock.getElapsedTime();
    // cube.current.position.x = 2 + Math.sin(time * 2);
    cube.current.rotation.y += delta * 0.2;
  });

  const { color, opacity, blur } = useControls("contact shadows", {
    color: "#1d8f75",
    opacity: { value: 0.4, min: 0, max: 1 },
    blur: { value: 2.8, min: 0, max: 10 },
  });

  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  return (
    <>
      {/* <BakeShadows /> */}
      {/* <SoftShadows size={25} samples={10} focus={0} /> */}

      <color attach="background" args={["skyblue"]} />

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/* <AccumulativeShadows position={[0, -0.99, 0]} color="316d39" frames={100} temporal>
        <RandomizedLight
          amount={8}
          radius={1}
          ambient={0.5}
          intensity={3}
          position={[1, 2, 3]}
          bias={0.001}
        />
      </AccumulativeShadows> */}
      <ContactShadows
        position={[0, -0.99, 0]}
        scale={10}
        resolution={512}
        far={5}
        color={color}
        opacity={opacity}
        blur={blur}
        frames={1}
      />

      <directionalLight
        ref={directionalLight}
        position={sunPosition}
        intensity={4.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <ambientLight intensity={1.5} />

      <Sky sunPosition={sunPosition} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow ref={cube} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
