import "./StartPage.css";
import paper from "../assets/paper.png";
import randomButton from "../assets/RandomButton.png";
import joinButton from "../assets/joinButton.png";
import createButton from "../assets/createButton.png";
import computerButton from "../assets/computerButton.png";
import { preloadImages } from "../../utils/util";
import { useEffect, useState } from "react";
function StartPage({
  socket,
  setIsGameStarted,
  isConnected,
  setIsConnected,
  setPlayOffline,
}) {
  const imageSources = [
    paper,
    randomButton,
    joinButton,
    createButton,
    computerButton,
  ];
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    preloadImages(imageSources)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });

    socket.on("connect", () => {
      console.log("connected");
      setIsConnected(true);
    });
    socket.on("error", (er) => console.error(er));
    socket.on("roomCreated", ({ gameId }) => {
      console.log(gameId);
      navigator.clipboard
        .writeText(gameId)
        .then(() => {
          console.log("text copied");
          alert("id copied to clipboard");
        })
        .catch((err) =>
          alert(
            "failed to copy to clipboard you can check console for the code"
          )
        );
    });

    socket.on("gameStarted", (gameId) => {
      setIsGameStarted(true);
    });

    return () => {
      socket.off("error");
      socket.off("roomCreated");
      socket.off("gameStarted");
    };
  }, []);

  const handleCreate = () => {
    socket.emit("createRoom");
  };
  const handleJoin = () => socket.emit("joinRoom", prompt("enter room id"));
  const handleRandom = () => socket.emit("joinRandom");
  const handleComputer = () => {
    setIsGameStarted(true);
    setPlayOffline(true);
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-screen-container">
          <div className="outer-spinner">
            <div className="inner-spinner"></div>
          </div>
          <p className="loading-text">Loading Assets...</p>
        </div>
      ) : (
        <div className="page-container">
          {!isConnected && (
            <div className="connecting-container">
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
              <p>connecting...</p>
            </div>
          )}
          <div className="paper-container">
            <img src={paper} alt="" />
          </div>
          <div className="game-title">
            <h1>Rock Paper Scissors</h1>
          </div>
          <div className="all-buttons">
            <div
              onClick={() => handleCreate()}
              className={`create-btn ${
                isConnected ? `btn-active` : `btn-disabled`
              }`}
            >
              <img src={createButton} alt="" />
            </div>
            <div
              onClick={() => handleJoin()}
              className={`join-btn ${
                isConnected ? `btn-active` : `btn-disabled`
              }`}
            >
              <img src={joinButton} alt="" />
            </div>
            <div
              onClick={() => handleRandom()}
              className={`random-btn ${
                isConnected ? `btn-active` : `btn-disabled`
              }`}
            >
              <img src={randomButton} alt="" />
            </div>
            <div
              onClick={() => handleComputer()}
              className="computer-btn btn-active"
            >
              <img src={computerButton} alt="" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default StartPage;
