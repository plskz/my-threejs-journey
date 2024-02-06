import { useLoader } from "@react-three/fiber";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";

export default function Model() {
  const model = useLoader(GLTFLoader, "./hamburger.glb", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    loader.setDRACOLoader(dracoLoader);
  });

  return <primitive object={model.scene} scale={0.35} />;
}
