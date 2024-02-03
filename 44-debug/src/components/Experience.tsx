import { OrbitControls } from "@react-three/drei";
import { button, useControls } from "leva";
import { Perf } from "r3f-perf";

export default function Experience() {
  const sphereConfig = useControls("Sphere", {
    position: {
      value: { x: -2, y: 0 },
      step: 0.01,
      joystick: "invertY",
    },
    color: "#ff0000",
    visible: true,
    clickMe: button(() => console.log("clicked!")),
    choices: { options: ["a", "b", "c"] },
  });

  const boxConfig = useControls("Box", {
    position: {
      value: { x: 2, y: 0 },
      step: 0.01,
      joystick: "invertY",
    },
    color: "#00ff00",
    visible: true,
  });

  return (
    <>
      {/* doesn't work */}
      {/* <Perf position="top-left" /> */}

      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh
        position={[sphereConfig.position.x, sphereConfig.position.y, 0]}
        visible={sphereConfig.visible}
      >
        <sphereGeometry />
        <meshStandardMaterial color={sphereConfig.color} />
      </mesh>

      <mesh
        position={[boxConfig.position.x, boxConfig.position.y, 0]}
        scale={1.5}
        visible={boxConfig.visible}
      >
        <boxGeometry />
        <meshStandardMaterial color={boxConfig.color} />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
