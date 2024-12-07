import { Server as HTTPServer } from "http"
import { Socket, Server as WebsocketServer } from "socket.io"
import {} from "../../frontend/AppContext/useWebsockets"
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../shared/types/message-to-server"
import { GameState } from "../Game/game"
import { ConnectedClient } from "./connected-client"
import { GameLobby, GameLobbyInfo } from "./game-lobby"

export type ClientInfo = {
  id: number
  name: string
  ready?: boolean
}

export type HostState = {
  connectedClients: ClientInfo[]
  gameLobbies: GameLobbyInfo[]
}

console.log("-- host")
// Allow connections from your React app
const portThatReactStartRunsOn = 3000

export type GameSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  {},
  ClientInfo
>

export class Host {
  websocketServer: WebsocketServer<
    ClientToServerEvents,
    ServerToClientEvents,
    {},
    ClientInfo
  >

  connectedClients: ConnectedClient[] = []
  gameLobbies: GameLobby[] = []

  constructor(public server: HTTPServer) {
    this.websocketServer = new WebsocketServer<
      ClientToServerEvents,
      ServerToClientEvents,
      {},
      ClientInfo
    >(server, {
      cors: {
        origin: `http://localhost:${portThatReactStartRunsOn}`,
        methods: ["GET", "POST"],
        credentials: true,
      },
    })
    this.websocketServer.on("connection", (socket: Socket) => {
      const { id, name } = socket.handshake.query
      const clientInfo: ClientInfo = {
        id: Number(id),
        name: name as string,
      }

      const existingClient = this.connectedClients.find(
        (client) => client.id == clientInfo.id
      )
      if (existingClient) {
        console.log(`** ${name} has reconnected`)
        existingClient.socket = socket
      } else {
        console.log(`** ${name} has connected`)
        new ConnectedClient({ host: this, socket, ...clientInfo })
      }
      console.log(
        `Connected Clients [${this.connectedClients.map(({ name }) => name)}]`
      )
      this.emitHostState()
    })
  }
  emitHostState() {
    console.log("emitHostState")
    this.websocketServer.emit("hostStateUpdate", this.getHostState())
  }

  emitGameState(gameState: GameState) {
    console.log("emitGameState")
    this.websocketServer.emit("gameStateUpdate", gameState)
  }

  getHostState(): HostState {
    return {
      connectedClients: this.connectedClients.map(({ id, name, ready }) => ({
        id,
        name,
        ready,
      })),
      gameLobbies: this.gameLobbies.map((lobby) => lobby.gameLobbyInfo),
    }
  }
}
