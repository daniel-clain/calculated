import { Server, Socket } from "socket.io"
import { GameLobby } from "../../shared/types/game-lobby"
import { Game, GameInfo, GameState } from "../Game/game"
import { ConnectedClient, PendingClient } from "./client"

export type ClientInfo = {
  id: number
  name: string
  ready?: boolean
}

export type HostState = {
  connectedClients: ClientInfo[]
  activeGames: GameInfo[]
  gameLobbies: GameLobby[]
}

console.log("-- host")
export class Host {
  pendingClients: PendingClient[] = []
  connectedClients: ConnectedClient[] = []
  activeGames: Game[] = []
  gameLobbies: GameLobby[] = []

  constructor(public websocketServer: Server) {
    websocketServer.on("connection", this.handleNewSocketConnection.bind(this))
  }
  handleNewSocketConnection(socket: Socket) {
    const pendingClient = new PendingClient(this, socket)
    this.pendingClients.push(pendingClient)
  }

  registerClient(id: number, name: string, socket: Socket) {
    this.pendingClients = this.pendingClients.filter(
      (client) => client.socket.id !== socket.id
    )

    const existingClient = this.connectedClients.find((p) => p.id == id)

    if (existingClient) {
      console.log(`${existingClient.name} has reconnected`)

      existingClient.name = name
      existingClient.socket = socket
      existingClient.connected = true

      const existingGame = this.activeGames.find((g) =>
        g.players.find((player) => player.id == id)
      )
      if (existingGame) {
        existingGame.handlePlayerReconnected(existingClient.id)
      }
    } else {
      console.log(`${name} has connected`)

      const connectedClient = new ConnectedClient(this, id, name, socket)
      this.connectedClients.push(connectedClient)
    }

    this.emitHostStateToClients()
  }

  emitGameUpdateToClients(gameState: GameState) {
    const clients = gameState.players.map(
      (player) => this.connectedClients.find((c) => c.id === player.id)!
    )
    clients.forEach((client) => client.socket.emit("GameState", gameState))
  }

  emitHostStateToClients() {
    this.websocketServer.emit("HostState", this.getHostState())
  }

  getHostState(): HostState {
    return {
      activeGames: this.activeGames.map(
        ({ gameId, players, timer, finalEvent }) => ({
          gameId,
          players: players.map(({ name, id }) => ({ name, id })),
          currentTime: timer.timeStep,
          timeUntilEnd: finalEvent.activationTime - timer.timeStep,
        })
      ),
      connectedClients: this.connectedClients.map(({ id, name, ready }) => ({
        id,
        name,
        ready,
      })),
      gameLobbies: this.gameLobbies,
    }
  }
}
