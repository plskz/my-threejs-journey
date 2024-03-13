import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Glitch,
  Noise,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, DepthEffect, GlitchMode } from "postprocessing";
import { useControls } from "leva";
import Drunk from "./Drunk";
import { useEffect, useRef } from "react";
import DrunkEffect from "./DrunkEffect";

export default function Experience() {
  const drunkRef = useRef<DrunkEffect>(null!);

  // const { currentBlendFunction } = useControls({
  //   currentBlendFunction: {
  //     options: Object.keys(BlendFunction),
  //     value: "NORMAL",
  //   },
  // });

  const drunkProps = useControls("Drunk Effect", {
    frequency: { value: 10.6, min: 1, max: 20 },
    amplitude: { value: 0.1, min: 0, max: 1 },
    blendFunction: {
      options: Object.fromEntries(
        Object.entries(BlendFunction).map(([key, value]) => [key, value]),
      ),
      value: BlendFunction.DARKEN,
    },
  });

  return (
    <>
      <color attach="background" args={["#ffffff"]} />

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
        {/* <Bloom luminanceThreshold={1.1} mipmapBlur /> */}
        {/* <DepthOfField
          focusDistance={0.025}
          focalLength={0.025}
          bokehScale={6}
        /> */}

        <Drunk ref={drunkRef} {...drunkProps} />
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
        <meshBasicMaterial color="mediumpurple" toneMapped={false} />
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
