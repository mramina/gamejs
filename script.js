const Gameboard = (() => {
  let board = Array(9).fill(null); //инициализация игрового поля

  const makeMove = (index, player) => {
    if (!board[index]) {
      board[index] = player.marker; //установка символа игрока
      return true;
    }
    return false;
  };

  const reset = () => {
    board = Array(9).fill(null); //сброс игрового поля
  };

  const getBoard = () => board.slice(); //возвращение поля

  return {
    makeMove,
    reset,
    getBoard,
  };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const Game = (() => {
  let players = [];
  let currentPlayerIndex = 0;

  const startGame = (playerNames) => {
    players[0] = Player(playerNames[0], "X");
    players[1] = Player(playerNames[1], "O");
    currentPlayerIndex = 0;
    Gameboard.reset();
    DisplayController.resetDisplay();
    document.getElementById("result-message").textContent = "";
    console.log("Игра началась!");
  };

  const makeMove = (index) => {
    const player = players[currentPlayerIndex];
    if (Gameboard.makeMove(index, player)) {
      if (checkWinner(player.marker)) {
        console.log(`${player.name} выиграл!`);
        document.getElementById(
          "result-message"
        ).textContent = `${player.name} выиграл!`;
        document.getElementById(
          "result-message"
        ).className = currentPlayerIndex === 0 ? 'winner-message player1-win' : 'winner-message player2-win';
        return true;
      }
      currentPlayerIndex = (currentPlayerIndex + 1) % 2;
    } else {
      console.log("Эта ячейка занята!");
    }
    return false;
  };

  const checkWinner = (marker) => {
    const board = Gameboard.getBoard();
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningCombinations.some((combination) =>
      combination.every((index) => board[index] === marker)
    );
  };

  return {
    startGame,
    makeMove,
  };
})();

const DisplayController = (() => {
  const boardElements = document.querySelectorAll(".board-cell");

  const updateBoardDisplay = () => {
    const board = Gameboard.getBoard();
    boardElements.forEach((cell, index) => {
      cell.textContent = board[index] ? board[index] : "";
      if (board[index] === "X") {
        cell.classList.add("cross");
        cell.classList.remove("nought");
      } else if (board[index] === "O") {
        cell.classList.add("nought");
        cell.classList.remove("cross");
      }
    });
  };

  const resetDisplay = () => {
    boardElements.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("cross", "nought");
    });
  };

  boardElements.forEach((cell) => {
    cell.addEventListener("click", () => {
      const index = parseInt(cell.dataset.index);
      const gameFinished = Game.makeMove(index);
      updateBoardDisplay();
    });
  });

  return {
    updateBoardDisplay,
    resetDisplay,
  };
})();

document.getElementById("start-game").addEventListener("click", () => {
  const player1Name =
    document.getElementById("player1-name").value || "Игрок 1";
  const player2Name =
    document.getElementById("player2-name").value || "Игрок 2";
  Game.startGame([player1Name, player2Name]);
});
