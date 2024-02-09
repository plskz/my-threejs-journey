import DrunkEffect from "./DrunkEffect";

export default function Drunk(props: { frequency: number; amplitude: number }) {
  const effect = new DrunkEffect(props);

  return <primitive object={effect} />;
}
