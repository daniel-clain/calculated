import { createContext, ReactNode } from "react"
import { GameState } from "../../backend/Game/game"
import {
  GetServerFunctionArgs,
  ServerFunctionNames,
} from "../../shared/types/message-to-server"

export interface SendCallback {
  <Name extends ServerFunctionNames>(
    name: Name,
    args: GetServerFunctionArgs<Name>
  ): void
}

/* type here seems redundant, is there a way to derive it? */
export type ContextProps = {
  gameState: GameState
}

export const GameContext = createContext<ContextProps>({} as ContextProps)

export const GameProvider = ({
  gameState,
  children,
}: {
  gameState: GameState
  children: ReactNode
}) => {
  const contextValue: ContextProps = {
    gameState,
  }

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  )
}
