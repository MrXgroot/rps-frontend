import { useState, useEffect } from "react";
import StartPage from "./Components/StartPage.jsx";
import "./App.css";
import GameBoard from "./Components/GameBoard.jsx";
import { io } from "socket.io-client";

const socket = io("https://rps-backend-39x6.onrender.com");

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [playOffline, setPlayOffline] = useState(false);
  return (
    <>
      <div className="app-container">
        {!isGameStarted ? (
          <StartPage
            socket={socket}
            setIsGameStarted={setIsGameStarted}
            setIsConnected={setIsConnected}
            isConnected={isConnected}
            setPlayOffline={setPlayOffline}
          ></StartPage>
        ) : (
          <GameBoard playOffline={playOffline} socket={socket}></GameBoard>
        )}
      </div>
    </>
  );
}

export default App;
