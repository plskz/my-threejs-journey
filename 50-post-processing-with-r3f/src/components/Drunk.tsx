import { forwardRef } from "react";
import DrunkEffect from "./DrunkEffect";
import { BlendFunction } from "postprocessing";

export default forwardRef(function Drunk(
  props: {
    frequency: number;
    amplitude: number;
    blendFunction?: BlendFunction;
  },
  ref: React.Ref<DrunkEffect>,
) {
  const effect = new DrunkEffect(props);

  return <primitive ref={ref} object={effect} />;
});
