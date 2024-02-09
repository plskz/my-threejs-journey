import {
  OrbitControls,
  meshBounds,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { BoxGeometry, MeshStandardMaterial } from "three";

const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export default function Experience() {
  const hamburger = useGLTF("./hamburger.glb");

  // hover
  const [hovered, set] = useState(false);
  useCursor(hovered);

  // cube
  const cube = useRef<THREE.Mesh<BoxGeometry, MeshStandardMaterial>>(null!);
  const cubeHandler = () => {
    cube.current.material.color.set(generateRandomColor());
  };
  useFrame((_, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh position-x={-2} onClick={(e) => e.stopPropagation()}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh
        ref={cube}
        raycast={meshBounds}
        position-x={2}
        scale={1.5}
        onClick={cubeHandler}
        onPointerEnter={() => set(true)}
        onPointerLeave={() => set(false)}
      >
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      <primitive
        object={hamburger.scene}
        scale={0.25}
        position-y={0.5}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          console.log(event.object.name);
        }}
      />
    </>
  );
}
