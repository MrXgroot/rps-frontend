import "./GameBoard.css";
import rock from "../assets/rock.png";
import paper from "../assets/paper.png";
import scissor from "../assets/scissor.png";
import playerAvatar from "../assets/playerAvatar.png";
import opponentAvatar from "../assets/opponentAvatar.png";
import stars from "../assets/stars.png";
import rockButton from "../assets/rockButton.png";
import paperButton from "../assets/paperButton.png";
import scissorButton from "../assets/scissorButton.png";
import victoryImage from "../assets/victory.png";
import defeatImage from "../assets/defeat.png";
import playAgainBtn from "../assets/play_again_button.png";
import newGameBtn from "../assets/new_game_button.png";
import backBtn from "../assets/backButton.png";
import winIndicator from "../assets/winIndicator.png";
import loseIndicator from "../assets/loseIndicator.png";
import tieIndicator from "../assets/tieIndicator.png";
import { useState, useRef, useEffect } from "react";
import RpsEngine from "../../engine/RpsEngine";

function GameBoard({ socket, playOffline }) {
  const assets = {
    rock,
    paper,
    scissor,
    player1: winIndicator,
    tie: tieIndicator,
    player2: loseIndicator,
    player: victoryImage,
    opponent: defeatImage,
  };
  // const [playerChoice, setPlayerChoice] = useState(null);
  const [result, setResult] = useState({
    player1: "rock",
    player2: "rock",
    playerScore: 3,
    opponentScore: 3,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showWinnerDisplay, setShowWinnerDisplay] = useState(false);

  const rps = useRef(new RpsEngine());

  let playerSelection = result.player1;
  let opponentSelection = result.player2;
  let playerStars = result.playerScore;
  let opponentStars = result.opponentScore;

  //necessary functions
  const reloadPage = () => window.location.reload();
  const handlePlayAgain = () => {
    if (socket?.connected) {
      socket.emit("playAgain");
    } else {
      setResult({
        player1: "rock",
        player2: "rock",
        playerScore: 3,
        opponentScore: 3,
      });
      setShowWinnerDisplay(false);
      rps.current.resetGame();
    }
  };
  const handleNewGame = () => {
    if (socket?.connected) {
      socket.emit("joinRandom");
    } else {
      reloadPage();
    }
  };
  useEffect(() => {
    socket.on("validateSuccessfull", (response) => {
      setTimeout(() => {
        setResult(response);
        setIsAnimating(false);
        setShowResult(response.state);
        console.log(response.winner);
        setTimeout(() => {
          setShowResult(false);
          setShowWinnerDisplay(response.winner);
        }, 1000);
      }, 1000);
    });
    socket.on("disconnected", () => reloadPage());
    socket.on("resetGame", () => {
      setResult({
        player1: "rock",
        player2: "rock",
        playerScore: 3,
        opponentScore: 3,
      });
      setShowWinnerDisplay(false);
    });
    return () => {
      socket.off();
    };
  }, [socket]);

  const handleAnimation = (choice) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setResult((prev) => ({ ...prev, player1: "rock", player2: "rock" }));

    if (socket?.connected && !playOffline) {
      socket.emit("validateRps", choice);
    } else {
      let result = rps.current.validateRPS(choice);
      setTimeout(() => {
        setResult(result);
        setIsAnimating(false);
        setShowResult(result.state);
        setTimeout(() => {
          setShowResult(false);
          setShowWinnerDisplay(result.winner);
        }, 1000);
      }, 3000);
    }
  };

  const displayStars = (len) => {
    return Array.from({ length: len }, (_, i) => (
      <img key={i} src={stars} alt="Star" />
    ));
  };

  return (
    <div className="gameboard-container">
      <div className="score-card">
        <div className="player-details">
          <div className="player-avatar">
            <img src={playerAvatar} alt="" />
          </div>
          <div className="player-stars">{displayStars(playerStars)}</div>
        </div>

        <div className="opponent-details">
          <div className="opponent-stars">{displayStars(opponentStars)}</div>
          <div className={`opponent-avatar ${isAnimating ? `waiting` : ``} `}>
            <img src={opponentAvatar} alt="" />
          </div>
        </div>
      </div>

      <div className="hands-container">
        <div className={`player ${isAnimating ? `animate` : ``}`}>
          <img src={assets[playerSelection]} alt="" />
        </div>
        {showResult && (
          <div className="result-indicator">
            <img src={assets[showResult]} alt="" />
          </div>
        )}
        <div className={`opponent ${isAnimating ? `animate` : ``}`}>
          <img src={assets[opponentSelection]} alt="" />
        </div>
      </div>

      <div className="selection-container">
        <div className="buttons-container">
          <div className="rock-button">
            <img
              onClick={() => handleAnimation("rock")}
              src={rockButton}
              alt=""
            />
          </div>
          <div className="paper-button">
            <img
              onClick={() => handleAnimation("paper")}
              src={paperButton}
              alt=""
            />
          </div>
          <div className="scissor-button">
            <img
              onClick={() => handleAnimation("scissor")}
              src={scissorButton}
              alt=""
            />
          </div>
        </div>
      </div>
      {showWinnerDisplay && (
        <div className="winner-board-bg">
          <div className="winner-board">
            <div className="result-display">
              <img src={assets[showWinnerDisplay]} alt="" />
            </div>
            <div className="buttons-display">
              <div className="back-btn">
                <img src={backBtn} onClick={() => reloadPage()} alt="" />
              </div>
              <div className="play-again-btn">
                <img
                  src={playAgainBtn}
                  onClick={() => handlePlayAgain()}
                  alt=""
                />
              </div>
              <div className="new-game-btn">
                <img src={newGameBtn} onClick={() => handleNewGame()} alt="" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default GameBoard;
