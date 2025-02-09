import "./App.css";
import React, { useState, useEffect } from "react";

const generateBoard = () => {
  let numbers = Array.from({ length: 25 }, (_, i) => i + 1);
  numbers.sort(() => Math.random() - 0.5);
  return Array.from({ length: 5 }, (_, i) => numbers.slice(i * 5, i * 5 + 5));
};

const checkLines = (board) => {
  let lines = 0;

  // Check rows & columns
  for (let i = 0; i < 5; i++) {
    if (board[i].every((num) => num === "X")) lines++;
    if (board.map((row) => row[i]).every((num) => num === "X")) lines++;
  }

  // Check diagonals
  if ([0, 1, 2, 3, 4].every((i) => board[i][i] === "X")) lines++;
  if ([0, 1, 2, 3, 4].every((i) => board[i][4 - i] === "X")) lines++;

  return lines;
};

export default function BingoGame() {
  const [playerBoard, setPlayerBoard] = useState(generateBoard());
  const [aiBoard, setAiBoard] = useState(generateBoard());
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [turn, setTurn] = useState("player");
  const [winner, setWinner] = useState(null);

  const markNumber = (board, num) => {
    return board.map((row) => row.map((val) => (val === num ? "X" : val)));
  };

  const playerMove = (num) => {
    if (!calledNumbers.includes(num)) {
      setCalledNumbers([...calledNumbers, num]);
      setPlayerBoard(markNumber(playerBoard, num));
      setAiBoard(markNumber(aiBoard, num));
      setTurn("ai");
    }
  };

  const aiMove = () => {
    let availableNumbers = aiBoard.flat().filter((n) => n !== "X" && !calledNumbers.includes(n));
    if (availableNumbers.length > 0) {
      let aiChoice = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      setCalledNumbers([...calledNumbers, aiChoice]);
      setPlayerBoard(markNumber(playerBoard, aiChoice));
      setAiBoard(markNumber(aiBoard, aiChoice));
      setTurn("player");
    }
  };

  useEffect(() => {
    if (turn === "ai" && !winner) {
      setTimeout(aiMove, 1000);
    }
  }, [turn]);

  useEffect(() => {
    let playerLines = checkLines(playerBoard);
    let aiLines = checkLines(aiBoard);

    if (playerLines >= 5) setWinner("Player");
    if (aiLines >= 5) setWinner("AI");
  }, [playerBoard, aiBoard]);

  return (
    <div className="p-5 text-center">
      <h1 className="text-2xl font-bold">🎉 Bingo Game 🎉</h1>
      {winner ? <h2 className="text-xl font-bold mt-3">{winner} Wins! 🏆</h2> : null}
      <div className="grid grid-cols-2 gap-5 mt-5">
        {turn === "player" && (
          <Board title="Your Board" board={playerBoard} onNumberClick={playerMove} />
        )}
        {turn === "ai" && (
          <Board title="AI Board" board={aiBoard} />
        )}
      </div>
      <button
        className="mt-5 px-5 py-2 bg-blue-500 text-white rounded"
        onClick={() => window.location.reload()}
      >
        Restart Game 🔄
      </button>
    </div>
  );
}

const Board = ({ title, board, onNumberClick }) => (
  <div className="border p-4 rounded-lg bg-gray-100">
    <h2 className="text-lg font-bold mb-2">{title}</h2>
    <div className="grid grid-cols-5 gap-1">
      {board.flat().map((num, i) => (
        <button
          key={i}
          className={`w-12 h-12 text-lg font-bold rounded ${num === "X" ? "bg-green-500 text-white" : "bg-white"}`}
          onClick={onNumberClick ? () => onNumberClick(num) : null}
          disabled={!onNumberClick || num === "X"}
        >
          {num}
        </button>
      ))}
    </div>
  </div>
);
