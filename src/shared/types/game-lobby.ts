import { ClientInfo } from "../../backend/Host/host"
export type GameLobby = {
  gameLobbyId: number
  creator: ClientInfo
  playersJoined: ClientInfo[]
}
