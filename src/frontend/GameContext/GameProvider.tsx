import {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react"
import { GameState } from "../../backend/Game/game"
import {} from "../../shared/types/message-to-server"

/* type here seems redundant, is there a way to derive it? */
export type ContextProps = {
  gameState: GameState
}

export type GameContextType = {
  gameState: GameState
  localTimeStep: number
}

export const GameContext = createContext<GameContextType>({} as GameContextType)

export const GameProvider = ({
  gameState,
  children,
}: PropsWithChildren<ContextProps>) => {
  const { timeStep } = gameState
  const [localTimeStep, setLocalTime] = useState(getTime())

  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    clearExistingInterval()
    setLocalTime(getTime())
    console.log("timeStep", timeStep)
    if (timeStep) {
      timeIntervalRef.current = setInterval(() => {
        setLocalTime((prev) => {
          console.log(prev, gameState.finalEvent.activationTime / 1000)
          if (prev < gameState.finalEvent.activationTime / 1000) {
            return prev + 1
          } else {
            clearExistingInterval()
            return prev
          }
        })
      }, 1000)
    }
    return clearExistingInterval
  }, [timeStep])

  function getTime() {
    return Math.round(timeStep / 1000)
  }

  function clearExistingInterval() {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current)
      timeIntervalRef.current = null
    }
  }

  const contextValue: GameContextType = {
    gameState,
    localTimeStep,
  }

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  )
}
