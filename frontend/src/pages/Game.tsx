import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Game() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("send-message", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-3xl font-bold">Partie en cours</h2>
      <div className="bg-white p-4 shadow-lg rounded mt-4 w-96">
        <div className="h-40 overflow-y-auto border p-2">
          {messages.map((msg, index) => (
            <p key={index} className="p-1 border-b">{msg}</p>
          ))}
        </div>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="border p-2 w-full mt-2" />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 mt-2 w-full">Envoyer</button>
      </div>
    </div>
  );
}
