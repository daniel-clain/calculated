import { handleClientToServerEvents } from "../../backend/Host/connected-client"
import { handleServerToClient } from "../../frontend/AppContext/useWebsockets"

export type ClientToServerEvents = ReturnType<typeof handleClientToServerEvents>
export type ClientToServerEventNames = keyof ClientToServerEvents

export type GetClientToServerEventArgs<Name extends ClientToServerEventNames> =
  Parameters<ClientToServerEvents[Name]>[0]

export type MessagesToServer<Name extends ClientToServerEventNames> = {
  name: Name
  args?: GetClientToServerEventArgs<Name>
}
const startGameMessageArgs: MessagesToServer<ClientToServerEventNames> = {
  name: "startGame",
  args: undefined,
}

const message: MessagesToServer<ClientToServerEventNames> = {
  name: "joinGameLobby",
  args: undefined,
}

export type ServerToClientEvents = ReturnType<typeof handleServerToClient>

/* 
export interface ClientToServerEvents {
  createGameLobby: () => void
  joinGameLobby: (roomId: string) => void
  leaveGameLobby: (message: string) => void
  closeGameLobby: (message: string) => void
  startGame: (message: string) => void
}

export interface ServerToClientEvents {
  hostStateUpdated: (hostState: HostState) => void
  gameStateUpdated: (gameState: GameState) => void
} */
