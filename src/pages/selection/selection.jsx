import { useContext, useEffect, useState } from "react";
import xando from "./../../assets/svg/xando.svg";
import "./selection.scss";
import { io } from "socket.io-client";
import axios from "axios";
import { Loader } from "src/components/loader";
import { StoreContext } from "src/context/store.context";
import { useNavigate } from "react-router-dom";

const states = {
  CREATE: "CREATE",
  JOIN: "JOIN",
  NONE: "NONE",
};

export const GameSelectionScreen = () => {
  const [selectionState, setSelectionState] = useState(states.NONE);
  const [isFetchingGameCode, setIsFetchingGameCode] = useState(false);
  const [inputGameId, setInputGameId] = useState("");
  const { setSocket, socket, gameId, setGameId } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleStateSelection = (e, state) => {
    e.preventDefault();
    setSelectionState(state);
  };

  useEffect(() => {
    const iSocket = io("https://tictactoe-be.fly.dev", {
      reconnectionDelayMax: 10000,
    });

    iSocket.on("connect", () => {
      console.log("Hello");
      setSocket(iSocket);
    });

    iSocket.on("room_joined", (data) => {
      console.log(data);
    });

    iSocket.on("room_filled", () => {
      navigate("/game");
    });
  }, []);

  const joinGame = () => {
    setGameId(inputGameId);
  };

  useEffect(() => {
    if (gameId) {
      if (socket) {
        socket.emit("join", gameId);
        localStorage.setItem(
          gameId,
          JSON.stringify({
            code: inputGameId.length ? "o" : "x",
            nextTurn: "x",
            roundStarter: "x",
          })
        );
      }
    }
  }, [gameId]);

  const getGameCode = async (e) => {
    e.preventDefault();
    setIsFetchingGameCode(true);

    try {
      const resp = await axios.get("https://tictactoe-be.fly.dev/create_game");
      setGameId(resp.data.gameId);
      setSelectionState(states.CREATE);
    } catch (e) {
      console.log(e);
    } finally {
      setIsFetchingGameCode(false);
    }
  };

  return (
    <main>
      {selectionState == states.CREATE && (
        <div>
          <h2>
            <span>Tell your friend to join the game with this ID</span>
            <span>{gameId}</span>
          </h2>
        </div>
      )}

      {selectionState == states.JOIN && (
        <div>
          <input
            type="text"
            placeholder="Game ID"
            value={inputGameId}
            onChange={(e) => setInputGameId(e.target.value)}
          />
          <button onClick={joinGame}>Join</button>
        </div>
      )}
      {selectionState == states.NONE && (
        <form>
          <img src={xando} alt="X and O Icons" />

          <button onClick={getGameCode}>
            {isFetchingGameCode ? <Loader /> : "Create Game"}
          </button>
          <button onClick={(e) => handleStateSelection(e, states.JOIN)}>
            Join Game
          </button>
        </form>
      )}
    </main>
  );
};
