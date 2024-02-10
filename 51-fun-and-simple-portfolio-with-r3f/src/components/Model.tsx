import { useGLTF } from "@react-three/drei";

export function Model() {
  const computer = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf",);

  return <primitive object={computer.scene} position-y={-1.2} />;
}
