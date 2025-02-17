import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Game from "./pages/Game";
import JoinGame from "./pages/JoinGame";
import Teams from "./pages/Teams";
// import Test from "./pages/Test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game/:partieId" element={<Game />} />
        <Route path="/join" element={<JoinGame />} />
        <Route path="/teams" element={<Teams />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
