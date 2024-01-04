import { PropsWithChildren, createContext, useState } from "react";
import { Socket } from "socket.io-client";

export const StoreContext = createContext<{
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
  gameId: string;
  setGameId: (newGameId: string) => void;
}>({
  socket: null,
  setSocket: (socket: Socket) => {},
  gameId: "",
  setGameId: () => {},
});

export const StoreContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameId, setGameId] = useState("");
  return (
    <StoreContext.Provider
      value={{
        socket,
        setSocket,
        gameId,
        setGameId,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
