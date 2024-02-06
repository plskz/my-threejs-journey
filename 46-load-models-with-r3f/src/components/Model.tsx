import { useGLTF } from "@react-three/drei";

export default function Model() {
  const model = useGLTF("./hamburger.glb");

  return <primitive object={model.scene} scale={0.35} />;
}
