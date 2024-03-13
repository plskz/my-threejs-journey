import {
  Center,
  OrbitControls,
  Sparkles,
  shaderMaterial,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import portalFragmentShader from "../shaders/portal/fragment.frag";
import portalVertexShader from "../shaders/portal/vertex.vert";

type GLTFResult = GLTF & {
  nodes: {
    poleLightA: THREE.Mesh;
    portalLight: THREE.Mesh;
    poleLightB: THREE.Mesh;
    baked: THREE.Mesh;
  };
  materials: {};
};

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#ffffff"),
    uColorEnd: new THREE.Color("#000000"),
  },
  portalVertexShader,
  portalFragmentShader,
);

extend({ PortalMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    portalMaterial: JSX.IntrinsicElements["shaderMaterial"];
  }
}

export default function Experience() {
  const { nodes } = useGLTF("./model/portal.glb") as GLTFResult;
  const bakedTexture = useTexture("./model/baked.jpg");
  bakedTexture.flipY = false;

  const portalMaterial = useRef<THREE.ShaderMaterial>(null!);

  const { colorStart, colorEnd } = useControls({
    colorStart: "#ffffff",
    colorEnd: "#000000",
  });

  useFrame((_, delta) => {
    portalMaterial.current.uniforms.uTime.value += delta;

    // leva: update portal color
    portalMaterial.current.uniforms.uColorStart.value.set(colorStart);
    portalMaterial.current.uniforms.uColorEnd.value.set(colorEnd);
  });

  return (
    <>
      <color args={["#030202"]} attach="background" />

      <OrbitControls makeDefault />

      <Center>
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={bakedTexture} />
        </mesh>

        <mesh
          geometry={nodes.poleLightA.geometry}
          position={nodes.poleLightA.position}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>
        <mesh
          geometry={nodes.poleLightB.geometry}
          position={nodes.poleLightB.position}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>

        <mesh
          geometry={nodes.portalLight.geometry}
          position={nodes.portalLight.position}
          rotation={nodes.portalLight.rotation}
        >
          <portalMaterial ref={portalMaterial} />
        </mesh>

        <Sparkles
          size={6}
          scale={[4, 2, 4]}
          position-y={1}
          speed={0.2}
          count={40}
        />
      </Center>
    </>
  );
}
