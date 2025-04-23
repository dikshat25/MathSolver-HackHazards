import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashBoard from './pages/DashBoard';
import MathInputPage from "./pages/InputBox";
import SettingsPage from "./pages/SettingPage";
import BrainZonePage from "./pages/Gamification";
import GraphGuessingGame from "./pages/games/guess-the-graph";
import MathEscapeRoom from "./pages/games/math-escape-room";
import { Toaster } from 'react-hot-toast';

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
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;