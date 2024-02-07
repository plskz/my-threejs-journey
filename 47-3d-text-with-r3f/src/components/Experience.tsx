import {
  Center,
  OrbitControls,
  Text3D,
  useMatcapTexture,
} from "@react-three/drei";
import { Perf } from "r3f-perf";

export default function Experience() {
  const [matcap] = useMatcapTexture(
    337, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json (0 to 640)
    256, // size of the texture ( 64, 128, 256, 512, 1024 )
  );

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

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
        >
          HELLO R3F
          <meshMatcapMaterial matcap={matcap} />
        </Text3D>
      </Center>

      {[...Array(100)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          scale={0.2 + Math.random() * 0.2}
        >
          <torusGeometry />
          <meshMatcapMaterial matcap={matcap} />
        </mesh>
      ))}
    </>
  );
}
