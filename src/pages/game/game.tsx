import xando from "./../../assets/svg/xando.svg";

import iconODef from "./../../assets/svg/icon-o-default.svg";
import iconXDef from "./../../assets/svg/icon-x-default.svg";
import iconRestart from "./../../assets/svg/icon-restart.svg";
import x from "./../../assets/svg/icon-x-default.svg";
import o from "./../../assets/svg/icon-o-default.svg";

import "./game.scss";
import {
  ComponentPropsWithoutRef,
  useContext,
  useEffect,
  useState,
} from "react";
import { StoreContext } from "src/context/store.context";
import { Loader } from "src/components/loader";
import { Navigate, useNavigate } from "react-router-dom";

const CELL_STATES = {
  empty: "",
  x: "x",
  o: "o",
};

const GAME_STATES = {
  playing: "playing",
  won: "won",
  lost: "lost",
  tied: "tied",
};

export const GameScreen = () => {
  const [cell1, setCell1] = useState(CELL_STATES.empty);
  const [cell2, setCell2] = useState(CELL_STATES.empty);
  const [cell3, setCell3] = useState(CELL_STATES.empty);
  const [cell4, setCell4] = useState(CELL_STATES.empty);
  const [cell5, setCell5] = useState(CELL_STATES.empty);
  const [cell6, setCell6] = useState(CELL_STATES.empty);
  const [cell7, setCell7] = useState(CELL_STATES.empty);
  const [cell8, setCell8] = useState(CELL_STATES.empty);
  const [cell9, setCell9] = useState(CELL_STATES.empty);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [winningCellsArr, setWinningCellsArr] = useState([]);
  const [winningClasses, setWinningClasses] = useState("");
  const [ties, setTies] = useState(0);
  const [gameState, setGameState] = useState(GAME_STATES.playing);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { gameId, socket } = useContext(StoreContext);
  const navigate = useNavigate();

  console.log(gameId);
  if (!gameId) return <Navigate to="/" />;

  let gameInfo = JSON.parse(localStorage.getItem(gameId));

  useEffect(() => {
    const code = gameInfo.code;
    const firstCol = cell1 == code && cell4 == code && cell7 == code;
    const secondCol = cell2 == code && cell5 == code && cell8 == code;
    const thirdCol = cell3 == code && cell6 == code && cell9 == code;
    const firstRow = cell1 == code && cell2 == code && cell3 == code;
    const secondRow = cell4 == code && cell5 == code && cell6 == code;
    const thirdRow = cell7 == code && cell8 == code && cell9 == code;
    const backwardDiag = cell1 == code && cell5 == code && cell9 == code;
    const forwardDiag = cell3 == code && cell5 == code && cell7 == code;

    if (
      cell1 != CELL_STATES.empty &&
      cell2 != CELL_STATES.empty &&
      cell3 != CELL_STATES.empty &&
      cell4 != CELL_STATES.empty &&
      cell5 != CELL_STATES.empty &&
      cell6 != CELL_STATES.empty &&
      cell7 != CELL_STATES.empty &&
      cell8 != CELL_STATES.empty &&
      cell9 != CELL_STATES.empty &&
      gameInfo.code == "x"
    ) {
      socket.emit("try_game_tie", {
        room: gameId,
      });
    }

    let winningCells = "";
    let winningClass = "";
    if (firstCol) {
      winningCells = "147";
      winningClass = "col first";
    }
    if (secondCol) {
      winningCells = "258";
      winningClass = "col second";
    }
    if (thirdCol) {
      winningCells = "369";
      winningClass = "col third";
    }
    if (firstRow) {
      winningCells = "123";
      winningClass = "row first";
    }
    if (secondRow) {
      winningCells = "456";
      winningClass = "row second";
    }
    if (thirdRow) {
      winningCells = "789";
      winningClass = "row third";
    }
    if (forwardDiag) {
      winningCells = "357";
      winningClass = "forwardDiag";
    }
    if (backwardDiag) {
      winningCells = "159";
      winningClass = "backwardDiag";
    }

    if (winningCells) {
      socket.emit("try_game_win", {
        room: gameId,
        winningCells,
        winningClass,
        code,
      });
    }
  }, [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9]);

  const handleRestart = () => {
    socket.emit("try_game_restart", {
      room: gameId,
      code: gameInfo.code,
    });
  };

  const handleCellClick = (e, cell) => {
    e.preventDefault();
    // switch (cell) {
    //   case 1:
    //     setCell1(gameInfo.code);
    //     break;
    //   case 2:
    //     setCell2(gameInfo.code);
    //     break;
    //   case 3:
    //     setCell3(gameInfo.code);
    //     break;
    //   case 4:
    //     setCell4(gameInfo.code);
    //     break;
    //   case 5:
    //     setCell5(gameInfo.code);
    //     break;
    //   case 6:
    //     setCell6(gameInfo.code);
    //     break;
    //   case 7:
    //     setCell7(gameInfo.code);
    //     break;
    //   case 8:
    //     setCell8(gameInfo.code);
    //     break;
    //   case 9:
    //     setCell9(gameInfo.code);
    //     break;
    // }
    socket.emit("try_game_move", {
      room: gameId,
      move: cell,
      code: gameInfo.code,
    });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    socket.emit("try_game_continue", {
      room: gameId,
    });
  };

  const resetGame = () => {
    setCell1(CELL_STATES.empty);
    setCell2(CELL_STATES.empty);
    setCell3(CELL_STATES.empty);
    setCell4(CELL_STATES.empty);
    setCell5(CELL_STATES.empty);
    setCell6(CELL_STATES.empty);
    setCell7(CELL_STATES.empty);
    setCell8(CELL_STATES.empty);
    setCell9(CELL_STATES.empty);

    setGameState(GAME_STATES.playing);
    setWinningCellsArr([]);
    setWinningClasses("");
  };

  useEffect(() => {
    if (socket) {
      socket.on("game_move", (data) => {
        console.log(data);
        console.log(gameInfo);
        localStorage.setItem(
          gameId,
          JSON.stringify({
            ...gameInfo,
            nextTurn: data.nextTurn,
          })
        );
        switch (data.move) {
          case 1:
            setCell1(data.code);
            break;
          case 2:
            setCell2(data.code);
            break;
          case 3:
            setCell3(data.code);
            break;
          case 4:
            setCell4(data.code);
            break;
          case 5:
            setCell5(data.code);
            break;
          case 6:
            setCell6(data.code);
            break;
          case 7:
            setCell7(data.code);
            break;
          case 8:
            setCell8(data.code);
            break;
          case 9:
            setCell9(data.code);
            break;
        }
      });
      socket.on(
        "game_win",
        (data: {
          code: string;
          winningCells: string;
          winningClass: string;
        }) => {
          const { code, winningCells, winningClass } = data;
          if (code == CELL_STATES.x) {
            setXWins((xWins) => xWins + 1);
          } else {
            setOWins((oWins) => oWins + 1);
          }
          if (code == gameInfo.code) {
            setGameState(GAME_STATES.won);
          } else {
            setGameState(GAME_STATES.lost);
          }

          let cells = winningCells.split("");
          setWinningCellsArr(cells);
          setWinningClasses(winningClass);
          setTimeout(() => {
            setWinningClasses(winningClass + " active");
          }, 500);
        }
      );
      socket.on("game_tie", (data) => {
        setGameState(GAME_STATES.tied);
        setTies((ties) => ties + 1);
      });
      socket.on("game_restart", (data) => {
        localStorage.setItem(
          gameId,
          JSON.stringify({
            ...gameInfo,
            nextTurn: gameInfo.roundStarter == "x" ? "o" : "x",
            roundStarter: gameInfo.roundStarter == "x" ? "o" : "x",
          })
        );
        const code = data.code;
        if (code == "x") {
          setOWins((oWins) => oWins + 1);
        } else if (code == "o") {
          setXWins((xWins) => xWins + 1);
        }
        resetGame();
        setIsModalOpen(false);
      });

      socket.on("game_continue", (data) => {
        localStorage.setItem(
          gameId,
          JSON.stringify({
            ...gameInfo,
            nextTurn: gameInfo.roundStarter == "x" ? "o" : "x",
            roundStarter: gameInfo.roundStarter == "x" ? "o" : "x",
          })
        );

        resetGame();
      });
    }
  }, []);

  return (
    <div className="wrapper">
      <div className={`modal ${isModalOpen ? "active" : ""}`}>
        <h3>
          <span>Restarting the game will count as a loss.</span>
          <span> Are you sure? </span>
        </h3>
        <div>
          <button onClick={() => setIsModalOpen(false)}>Go back</button>
          <button onClick={handleRestart}>Continue</button>
        </div>
      </div>
      <main className={`overlay ${isModalOpen ? "active" : ""}`}>
        <div className="tag">
          <p
            style={{
              color: gameInfo.code == CELL_STATES.o ? "#f2b137" : "#31c3bd",
            }}
          >
            PLAYER
          </p>
          <img src={gameInfo.code == CELL_STATES.o ? iconODef : iconXDef} />
        </div>
        <div className="topbar">
          <div>
            <img src={xando} alt="X and O Icons" />
          </div>
          <div>
            <img
              src={gameInfo.nextTurn == CELL_STATES.o ? iconODef : iconXDef}
            />
            <p
              style={{
                color:
                  gameInfo.nextTurn == CELL_STATES.o ? "#f2b137" : "#31c3bd",
              }}
            >
              &apos;S TURN
            </p>
          </div>
          <button onClick={() => setIsModalOpen(true)}>
            <img src={iconRestart} alt="restart" />
          </button>
        </div>
        {gameState == GAME_STATES.playing &&
          gameInfo.code != gameInfo.nextTurn && (
            <h3>Waiting for {gameInfo.nextTurn} to play...</h3>
          )}

        {gameState == GAME_STATES.won && <h3> You have won</h3>}
        {gameState == GAME_STATES.lost && <h3> You have lost</h3>}
        {gameState == GAME_STATES.tied && <h3> The game was tied</h3>}
        {gameState != GAME_STATES.playing && (
          <button onClick={handleContinue}>Continue</button>
        )}

        <div className={`board`}>
          <div className={`winnerbar ${winningClasses && winningClasses}`} />
          <ButtonSlot
            cellState={cell1}
            onClick={(e) => handleCellClick(e, 1)}
            gameState={gameState}
            enlarge={winningCellsArr.includes("1")}
            gameInfo={gameInfo}
          />
          <ButtonSlot
            cellState={cell2}
            onClick={(e) => handleCellClick(e, 2)}
            gameState={gameState}
            enlarge={winningCellsArr.includes("2")}
            gameInfo={gameInfo}
          />
          <ButtonSlot
            cellState={cell3}
            onClick={(e) => handleCellClick(e, 3)}
            gameState={gameState}
            enlarge={winningCellsArr.includes("3")}
            gameInfo={gameInfo}
          />
          <ButtonSlot
            cellState={cell4}
            onClick={(e) => handleCellClick(e, 4)}
            gameState={gameState}
            enlarge={winningCellsArr.includes("4")}
            gameInfo={gameInfo}
          />
          <ButtonSlot
            cellState={cell5}
            onClick={(e) => handleCellClick(e, 5)}
            gameState={gameState}
            enlarge={winningCellsArr.includes("5")}
            gameInfo={gameInfo}
          />
          <ButtonSlot
            cellState={cell6}
            onClick={(e) => handleCellClick(e, 6)}
            gameState={gameState}
            enlarge={winningCellsArr.includes("6")}
            gameInfo={gameInfo}
          />
          <ButtonSlot
            cellState={cell7}
            onClick={(e) => handleCellClick(e, 7)}
            gameState={gameState}
            enlarge={winningCellsArr.includes("7")}
            gameInfo={gameInfo}
          />
          <ButtonSlot
            cellState={cell8}
            onClick={(e) => handleCellClick(e, 8)}
            gameState={gameState}
            enlarge={winningCellsArr.includes("8")}
            gameInfo={gameInfo}
          />
          <ButtonSlot
            cellState={cell9}
            onClick={(e) => handleCellClick(e, 9)}
            gameState={gameState}
            enlarge={winningCellsArr.includes("9")}
            gameInfo={gameInfo}
          />
        </div>
        <div className="bottombar">
          <h3>Win Count</h3>
          <div>
            <div>
              <em>X (P1)</em>
              <p>{xWins}</p>
            </div>
            <div>
              <em>Ties</em>
              <p>{ties}</p>
            </div>
            <div>
              <em>O (P2)</em>
              <p>{oWins}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ButtonSlot: React.FC<
  ComponentPropsWithoutRef<"button"> & {
    cellState: string;
    gameState: string;
    enlarge: boolean;
    gameInfo: {
      code: string;
      nextTurn;
    };
  }
> = ({ cellState, gameState, onClick, enlarge, gameInfo, ...props }) => {
  const isCellActive =
    cellState == CELL_STATES.empty &&
    gameState == GAME_STATES.playing &&
    gameInfo.code === gameInfo.nextTurn;
  return (
    <button
      disabled={!isCellActive}
      className={`slot ${!isCellActive && "inactive"}`}
      onClick={isCellActive ? onClick : () => {}}
      {...props}
    >
      {cellState == CELL_STATES.x && (
        <img src={x} className={enlarge && "enlarge"} />
      )}
      {cellState == CELL_STATES.o && (
        <img src={o} className={enlarge && "enlarge"} />
      )}
    </button>
  );
};
