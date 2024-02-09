import { forwardRef } from "react";
import DrunkEffect from "./DrunkEffect";

export default forwardRef(function Drunk(
  props: {
    frequency: number;
    amplitude: number;
  },
  ref: React.Ref<DrunkEffect>,
) {
  const effect = new DrunkEffect(props);

  return <primitive ref={ref} object={effect} />;
});
