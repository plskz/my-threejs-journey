import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { useControls } from "leva";

export default function Fox() {
  const fox = useGLTF("./Fox/glTF/Fox.gltf");
  const animations = useAnimations(fox.animations, fox.scene);

  const { currentAnimation } = useControls({
    currentAnimation: {
      options: animations.names,
    },
  });

  useEffect(() => {
    const action = animations.actions[currentAnimation];
    action?.reset().fadeIn(0.5).play();

    return () => {
      action?.fadeOut(0.5);
    };
  }, [animations.actions, currentAnimation]);

  return (
    <primitive
      scale={0.02}
      position={[-2.5, -1, 2.5]}
      rotation-y={0.5}
      object={fox.scene}
    />
  );
}

useGLTF.preload("./Fox/glTF/Fox.gltf");