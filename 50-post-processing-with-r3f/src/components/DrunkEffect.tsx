import { Effect } from "postprocessing";

const fragmentShader = /*glsl*/ `
    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    {
        outputColor = vec4(uv, 1.0, 1.0);
    }
`;

export default class DrunkEffect extends Effect {
  constructor(props: { frequency: number; amplitude: number }) {
    super("DrunkEffect", fragmentShader, {});
    console.log(props);
  }
}
