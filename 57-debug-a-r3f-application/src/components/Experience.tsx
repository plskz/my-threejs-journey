import { OrbitControls } from "@react-three/drei";
import { button, useControls } from "leva";
import { Perf } from "r3f-perf";

const Sphere = () => {
  const { position, color, visible } = useControls("Sphere", {
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

  return (
    <mesh position={[position.x, position.y, 0]} visible={visible}>
      <sphereGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Box = () => {
  const { position, color, visible } = useControls("Box", {
    position: {
      value: { x: 2, y: 0 },
      step: 0.01,
      joystick: "invertY",
    },
    color: "#00ff00",
    visible: true,
  });

  return (
    <mesh position={[position.x, position.y, 0]} scale={1.5} visible={visible}>
      <boxGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default function Experience() {
  return (
    <>
      {/* doesn't work */}
      {/* <Perf position="top-left" /> */}

      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <Sphere />
      <Box />

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
