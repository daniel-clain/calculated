import { useContext } from "react"
import { GameContext } from "../GameContext/GameProvider"
import { Time_C } from "./game-subcomponents/Time"

export function Game_C() {
  const { gameState } = useContext(GameContext)

  return (
    <div>
      <Time_C />
      <h3>Players:</h3>
      {gameState.players.map((player) => (
        <div>
          <div>Name: {player.name}</div>
        </div>
      ))}
      <h3>Algorithm Items:</h3>
      {gameState.finalEvent.algorithmItems.map((algorithmItems) => (
        <div>
          <div>Condition: {algorithmItems.condition}</div>
          <div>Effect: {algorithmItems.effect}</div>
        </div>
      ))}
    </div>
  )
}
