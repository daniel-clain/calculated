import { useContext } from "react"

import "./App.css"
import { AppContext } from "./AppContext/AppProvider"
import { Game_C } from "./Game/Game"
import { GameProvider } from "./GameContext/GameProvider"
import { Host_C } from "./Host/Host"

export function App_C() {
  const { gameState } = useContext(AppContext)

  return gameState ? (
    <GameProvider gameState={gameState}>
      <Game_C />
    </GameProvider>
  ) : (
    <Host_C />
  )
}
