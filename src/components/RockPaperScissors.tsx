import { useState } from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "../Client";

type Choice = "Rock" | "Paper" | "Scissors";
type Result = "Win" | "Lose" | "Tie";

const Choices: Choice[] = ["Rock", "Paper", "Scissors"];

const getComputerChoice = (): Choice =>
  Choices[Math.floor(Math.random() * Choices.length)];

const determineWinner = (
  playerChoice: Choice,
  computerChoice: Choice
): Result => {
  if (playerChoice === computerChoice) return "Tie";

  if (
    (playerChoice === "Rock" && computerChoice === "Scissors") ||
    (playerChoice === "Scissors" && computerChoice === "Paper") ||
    (playerChoice === "Paper" && computerChoice === "Rock")
  ) {
    return "Win";
  }
  return "Lose";
};

interface GameResult {
  playerChoice: Choice;
  computerChoice: Choice;
  result: Result;
}

const RockPaperScissors = () => {
  const account = useActiveAccount();
  const [result, setResult] = useState<GameResult | null>(null);
  const [showPrize, setShowPrize] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [prizeClaimed, setPrizeClaimed] = useState<boolean>(false);

  const handleChoice = (playerChoice: Choice) => {
    const computerChoice = getComputerChoice();
    const GameResult = determineWinner(playerChoice, computerChoice);
    setResult({ playerChoice, computerChoice, result: GameResult });
    setShowPrize(GameResult === "Win");
  };

  const resetGame = () => {
    setResult(null);
    setShowPrize(false);
    setPrizeClaimed(false);
  };

  const claimPrize = () => {
    setShowModal(true);
  };

  return (
    <div className="bg-[#f0f0f0] text-[#333] h-screen w-screen flex justify-center items-center">
      <div className="bg-white p-[2rem] m-[0 0.5rem] w-[400px] max-w-[90%] rounded-lg shadow-md flex flex-col items-center">
        <h2 className="text-sm font-bold mb-4">Rock Paper Scissors</h2>
        {account ? (
          <ConnectButton
            client={client}
            wallets={[
              inAppWallet({
                auth: {
                  options: ["email"],
                },
              }),
            ]}
          />
        ) : (
          <>
            {!result ? (
              <div>
                <h3>Choose your option</h3>
                <div className="flex justify-center items-center mt-4 w-full">
                  {Choices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => handleChoice(choice)}
                      className="!bg-blue-500 hover:scale-105 active:scale-95 duration-75 text-white px-4 py-2 m-2 rounded-lg"
                    >
                      {choice === "Rock"
                        ? "🪨"
                        : choice === "Paper"
                        ? "📄"
                        : "✂️"}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p>You chose: {result.playerChoice}</p>
                <p>Computer chose: {result.computerChoice}</p>
                <h3>Result: {result.result}</h3>
                <div>
                  <button
                    onClick={resetGame}
                    className="!bg-green-500 hover:scale-105 active:scale-95 duration-75 text-white px-4 py-2 m-2 rounded-lg"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RockPaperScissors;
