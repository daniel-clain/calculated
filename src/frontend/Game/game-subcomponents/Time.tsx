import { useContext } from "react"
import { GameContext } from "../../GameContext/GameProvider"

export function Time_C() {
  const { localTimeStep } = useContext(GameContext)

  return <h3>Time: {localTimeStep}</h3>
}
