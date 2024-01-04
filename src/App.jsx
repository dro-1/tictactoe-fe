import { Route, Routes } from "react-router-dom";
import "./App.css";
import { GameScreen } from "./pages/game/game.tsx";
import { GameSelectionScreen } from "./pages/selection/selection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GameSelectionScreen />} />
      <Route path="/game" element={<GameScreen />} />
    </Routes>
  );
}

export default App;
