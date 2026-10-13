import {Composition} from "remotion";
import {RWBFacts} from "./RWBFacts";
import {Carousel} from "./Carousel";
import {H, W} from "./carousel";
import {FPS, TOTAL} from "./facts";

export const Root = () => (
  <>
  <Composition id="Carousel" component={Carousel} durationInFrames={1} fps={30} width={W} height={H} defaultProps={{index: 0}} />
  <Composition id="RWBFacts" component={RWBFacts} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
  </>
);
