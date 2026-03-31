import GameContainer from "./components/Layout/GameContainer";
import { GameProvider } from "./contexts/GameContext";

const App = () => {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
};

export default App;
