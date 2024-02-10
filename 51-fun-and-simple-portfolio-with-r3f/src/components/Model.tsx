import { Html, useGLTF } from "@react-three/drei";

export function Model() {
  const computer = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf",
  );

  return (
    <primitive object={computer.scene} position-y={-1.2}>
      <Html
        transform
        distanceFactor={1.17}
        position={[0, 1.56, -1.4]}
        rotation-x={-0.256}
      >
        <iframe
          className="h-[670px] w-[1024px] rounded-3xl border-none bg-black"
          src="https://plskz-me.vercel.app/"
        />
      </Html>
    </primitive>
  );
}
