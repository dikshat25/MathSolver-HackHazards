import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MathInputPage from "./pages/InputBox";
import SettingsPage from "./pages/SettingPage";
import BrainZonePage from "./pages/Gamification";
import GraphGuessingGame from "./pages/games/guess-the-graph";  
import MathEscapeRoom from "./pages/games/math-escape-room";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/math-input" element={<MathInputPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/brain-zone" element={<BrainZonePage />} />
        <Route path="/games/guess-the-graph" element={<GraphGuessingGame />} />
        <Route path="/games/math-escape-room" element={<MathEscapeRoom />} />
      </Routes>
    </Router>
  );
}

export default App;