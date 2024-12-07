import { GameInfo } from "../src/backend/Game/game"
import { ClientInfo, HostState } from "../src/backend/Host/host"
import { GameLobby } from "../src/shared/types/game-lobby"

interface IHost extends HostState {}
class Host implements IHost {
  connectedClients: ClientInfo[]
  activeGames: GameInfo[]
  gameLobbies: GameLobby[]
}
