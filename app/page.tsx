import Clouds from "./clouds";
import DigApp from "./dig-app";
import Ground from "./ground";
import Scenery from "./scenery";
import Sun from "./sun";

// Static pixel art renders on the server; DigApp handles the game state.
export default function Home() {
  return (
    <DigApp
      sky={
        <>
          <Sun />
          <Clouds />
        </>
      }
      scenery={<Scenery />}
      ground={<Ground />}
    />
  );
}
