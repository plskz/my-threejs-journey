import {
  Html,
  OrbitControls,
  PivotControls,
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

      <mesh ref={cube} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <TransformControls object={cube} />

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
