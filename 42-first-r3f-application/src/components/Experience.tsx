import { extend, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import CustomObject from "@/components/CustomObject";

extend({ OrbitControls });

export default function Experience() {
  const { camera, gl } = useThree();
  const cubeRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    cubeRef.current.rotation.x += delta;
    // groupRef.current.rotation.y += delta;
  });

  return (
    <>
      <orbitControls args={[camera, gl.domElement]} />

      <ambientLight intensity={1.5} />
      <directionalLight position={[1, 2, 3]} intensity={4.5} />

      <group ref={groupRef}>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
        <mesh ref={cubeRef} position-x={2} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </group>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={20}>
        <planeGeometry />
        <meshStandardMaterial color="yellowgreen" />
      </mesh>

      <CustomObject />
    </>
  );
}
