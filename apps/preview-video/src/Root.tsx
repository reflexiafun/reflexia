import "./index.css";
import { Composition } from "remotion";
import { ReflexiaPromo } from "./ReflexiaPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ReflexiaPromo"
        component={ReflexiaPromo}
        durationInFrames={1830}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
