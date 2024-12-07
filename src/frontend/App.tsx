import { useContext, useEffect } from "react"

import "./App.css"
import { AppContext } from "./AppContext/AppProvider"
import { Game_C } from "./Game/Game"
import { GameProvider } from "./GameContext/GameProvider"
import { Host_C } from "./Host/Host"

export function App_C() {
  const { gameState, localName, connected, connectToWebsocketServer } =
    useContext(AppContext)
  useEffect(() => {
    // Only create a socket connection if playerId and playerName exist
    if (localName && !connected) {
      const socket = connectToWebsocketServer()

      // Cleanup function to disconnect the socket when component unmounts
      return () => {
        console.log("Disconnecting socket...")
        socket.disconnect()
      }
    }
  }, [localName])

  return gameState ? (
    <GameProvider gameState={gameState}>
      <Game_C />
    </GameProvider>
  ) : (
    <Host_C />
  )
}
