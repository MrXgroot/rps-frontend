class RpsEngine {
  constructor() {
    this.maxScore = 3;
    this.player1Score = 3;
    this.player2Score = 3;
    this.validChoices = ["rock", "paper", "scissor"];
  }

  getRandomChoice() {
    return this.validChoices[
      Math.floor(Math.random() * this.validChoices.length)
    ];
  }
  resetGame() {
    this.player1Score = 3;
    this.player2Score = 3;
  }
  validateRPS(player1Choice, player2Choice = null) {
    if (!player1Choice) return;
    player2Choice = player2Choice ? player2Choice : this.getRandomChoice();
    const result = {
      player1: player1Choice,
      player2: player2Choice,
      playerScore: this.player1Score,
      opponentScore: this.player2Score,
    };

    if (player1Choice === player2Choice) {
      result.state = "tie";
    } else if (
      (player1Choice === "rock" && player2Choice === "scissor") ||
      (player1Choice === "paper" && player2Choice === "rock") ||
      (player1Choice === "scissor" && player2Choice === "paper")
    ) {
      result.state = "player1";
      this.player2Score--;
      result.opponentScore--;
    } else {
      result.state = "player2";
      this.player1Score--;
      result.playerScore--;
    }
    if (result.playerScore == 0) {
      result.winner = "opponent";
    } else if (result.opponentScore == 0) {
      result.winner = "player";
    }
    return result;
  }
}

export default RpsEngine;
