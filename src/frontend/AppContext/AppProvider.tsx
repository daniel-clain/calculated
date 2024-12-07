import { createContext, Dispatch, ReactNode } from "react"
import { GameState } from "../../backend/Game/game"
import { HostState } from "../../backend/Host/host"
import {
  ClientToServerEventNames,
  MessagesToServer,
} from "../../shared/types/message-to-server"
import { useAppService } from "./useAppService"
import { GameSocketClient } from "./useWebsockets"

/* type here seems redundant, is there a way to derive it? */
export type ContextProps = {
  thisClientId: number
  localName?: string
  connected: boolean
  setLocalName: Dispatch<string>
  hostState: HostState
  gameState?: GameState
  send: <T extends ClientToServerEventNames>(
    message: MessagesToServer<T>
  ) => void
  connectToWebsocketServer: () => GameSocketClient
  isInAGameLobby: () => boolean
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
    connectToWebsocketServer,
    isInAGameLobby,
  } = useAppService()

  const contextValue: ContextProps = {
    thisClientId,
    localName,
    setLocalName,
    hostState,
    gameState,
    connected,
    send,
    connectToWebsocketServer,
    isInAGameLobby,
  }

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}
