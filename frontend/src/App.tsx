import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Game from "./pages/Game";
import JoinGame from "./pages/JoinGame";
import Teams from "./pages/Teams";
import {ProtectedJoin, ProtectedRoute} from "./components/ProtectedRoute"; // Importez le composant ProtectedRoute

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game/:partieId" element={<ProtectedRoute><Game /></ProtectedRoute>} />
        <Route path="/join" element={<ProtectedJoin><JoinGame /></ProtectedJoin>} />
        <Route path="/teams/:partieId" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;