import { createContext, Dispatch, ReactNode } from "react"
import { GameState } from "../../backend/Game/game"
import { HostState } from "../../backend/Host/host"
import {
  GetServerFunctionArgs,
  MessagesToServer,
  ServerFunctionNames,
} from "../../shared/types/message-to-server"
import { useAppService } from "./useAppService"

export interface SendCallback {
  <Name extends ServerFunctionNames>(
    name: Name,
    args: GetServerFunctionArgs<Name>
  ): void
}

/* type here seems redundant, is there a way to derive it? */
export type ContextProps = {
  localName?: string
  connected: boolean
  setLocalName: Dispatch<string>
  thisClientId: number
  hostState?: HostState
  gameState?: GameState
  send: <T extends ServerFunctionNames>(message: MessagesToServer<T>) => void
}

export const AppContext = createContext<ContextProps>({} as ContextProps)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const {
    thisClientId,
    localName,
    setLocalName,
    hostState,
    gameState,
    connected,
    send,
  } = useAppService()

  const contextValue: ContextProps = {
    thisClientId,
    localName,
    setLocalName,
    hostState,
    gameState,
    connected,
    send,
  }

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}
