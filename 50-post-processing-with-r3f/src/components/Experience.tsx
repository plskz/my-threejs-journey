import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
  Bloom,
  EffectComposer,
  Glitch,
  Noise,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";
import { useControls } from "leva";

export default function Experience() {
  const { currentBlendFunction } = useControls({
    currentBlendFunction: {
      options: Object.keys(BlendFunction),
      value: "NORMAL",
    },
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <EffectComposer disableNormalPass>
        {/* <Vignette
          offset={0.3}
          darkness={0.9}
          blendFunction={BlendFunction[currentBlendFunction]}
        /> */}
        {/* <Glitch
          delay={[0.5, 1]}
          duration={[0.1, 0.3]}
          strength={[0.2, 0.4]}
          mode={GlitchMode.CONSTANT_MILD}
        /> */}
        {/* <Noise premultiply blendFunction={BlendFunction[currentBlendFunction]} /> */}
        <Bloom luminanceThreshold={1.1} mipmapBlur />

        <ToneMapping />
      </EffectComposer>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        {/* <meshStandardMaterial color='white' emissive='mediumpurple' emissiveIntensity={10 } toneMapped={false} /> */}
        <meshBasicMaterial color={[1.5, 1, 4]} toneMapped={false} />
      </mesh>

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
