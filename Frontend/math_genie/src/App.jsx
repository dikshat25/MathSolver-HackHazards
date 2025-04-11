import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MathInputPage from "./pages/InputBox";
// Import other pages as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/math-input" element={<MathInputPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;