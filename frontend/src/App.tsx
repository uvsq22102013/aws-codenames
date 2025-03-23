import { LanguageProvider } from './Context/LanguageContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Game from "./pages/Game";
import JoinGame from "./pages/JoinGame";
import Teams from "./pages/Teams";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";

import {ProtectedJoin, ProtectedRoute} from "./components/ProtectedRoute"; // Importez le composant ProtectedRoute

function App() {
  return (
    <LanguageProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset/:code" element={<Reset />} />
        <Route path="/game/:partieId" element={<ProtectedRoute><Game /></ProtectedRoute>} />
        <Route path="/join" element={<ProtectedJoin><JoinGame /></ProtectedJoin>} />
        <Route path="/teams/:partieId" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;