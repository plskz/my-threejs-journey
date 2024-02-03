import {
  Float,
  Html,
  MeshReflectorMaterial,
  OrbitControls,
  PivotControls,
  Text,
  TransformControls,
} from "@react-three/drei";
import { useRef } from "react";

export default function Experience() {
  const cube = useRef<THREE.Mesh>(null!);
  const sphere = useRef<THREE.Mesh>(null!);

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        lineWidth={1}
        scale={100}
        fixed={true}
      >
        <mesh ref={sphere} position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
          <Html
            position={[1, 1, 0]}
            center
            distanceFactor={6}
            occlude={[sphere, cube]}
          >
            <div className="select-none overflow-hidden whitespace-nowrap rounded-3xl bg-black/60 p-4 text-white">
              <p>Sphere</p>
            </div>
          </Html>
        </mesh>
      </PivotControls>

      <Float speed={4} floatIntensity={4}>
        <mesh position={[0, 2, 0]}>
          <boxGeometry />
          <meshStandardMaterial color="lightblue" />
        </mesh>
      </Float>

      <mesh ref={cube} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
        <Html
          position={[0, 1, 0]}
          center
          distanceFactor={6}
          occlude={[sphere, cube]}
        >
          <div className="select-none overflow-hidden whitespace-nowrap rounded-3xl bg-black/60 p-4 text-white">
            <p>Cube</p>
          </div>
        </Html>
      </mesh>
      <TransformControls object={cube} />

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        {/* <meshStandardMaterial color="greenyellow" /> */}
        <MeshReflectorMaterial resolution={1024} mirror={0.75} />
      </mesh>

      {/* not working */}
      {/* <Text>I LOVE R3F</Text> */}
    </>
  );
}
