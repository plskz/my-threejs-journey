import {
  Center,
  OrbitControls,
  Text3D,
  useMatcapTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useEffect, useRef, useState } from "react";
import { MeshMatcapMaterial, TorusGeometry } from "three";
import * as THREE from "three";

const torusGeometry = new TorusGeometry(1, 0.6, 16, 32);
const material = new MeshMatcapMaterial();

export default function Experience() {
  // const [torusGeometry, setTorusGeometry] = useState<TorusGeometry>(null!);
  // const [material, setMaterial] = useState<MeshMatcapMaterial>(null!);
  const donuts = useRef<THREE.Mesh[]>([]);

  const [matcap] = useMatcapTexture(
    337, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json (0 to 640)
    256, // size of the texture ( 64, 128, 256, 512, 1024 )
  );

  useEffect(() => {
    matcap.colorSpace = THREE.SRGBColorSpace;
    matcap.needsUpdate = true;

    material.matcap = matcap;
    material.needsUpdate = true;
  });

  useFrame((_, delta) => {
    for (const donut of donuts.current) {
      donut.rotation.y += 0.2 * delta;
    }
  });

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/* <torusGeometry ref={setTorusGeometry} /> */}
      {/* <meshMatcapMaterial ref={setMaterial} matcap={matcap} /> */}

      <Center>
        <Text3D
          font="./fonts/helvetiker_regular.typeface.json"
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          material={material}
        >
          HELLO R3F
        </Text3D>
      </Center>
      {[...Array(100)].map((_, i) => (
        <mesh
          key={i}
          ref={(element) => (donuts.current[i] = element!)}
          geometry={torusGeometry}
          material={material}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          scale={0.2 + Math.random() * 0.2}
        ></mesh>
      ))}
    </>
  );
}
