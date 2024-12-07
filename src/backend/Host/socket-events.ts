/* import { Socket } from "socket.io"
import { GameLobby } from "../../shared/types/game-lobby"
import { Game, GameState } from "../Game/game"
import { PlayerInfo } from "../Game/player/player"
import { gameScenariosList } from "../Game/scenarios/scenario"
import { ConnectedClient } from "./client"
import { Host } from "./host"

export function handleSocketMessages({
  host,
  socket,
}: {
  host: Host
  socket: Socket
}) {
  function createGameLobby() {
    const client = getClientBySocket()
    host.gameLobbies.push({
      creator: { id: client.id, name: client.name },
      playersJoined: [],
      gameLobbyId: Date.now(),
    })
    host.emitHostStateToClients()
  }

  function joinGameLobby({ lobbyId }: { lobbyId: number }) {
    const client = getClientBySocket()
    host.gameLobbies.map((gameLobby) => {
      if (gameLobby.gameLobbyId == lobbyId) {
        gameLobby.playersJoined.push({ id: client.id, name: client.name })
      }
      return gameLobby
    })
    host.emitHostStateToClients()
  }

  function cancelLobby({ lobbyId }: { lobbyId: number }) {
    host.gameLobbies = host.gameLobbies.filter((gameLobby) => {
      return gameLobby.gameLobbyId != lobbyId
    })
    host.emitHostStateToClients()
  }

  function leaveLobby({ lobbyId }: { lobbyId: number }) {
    const client = getClientBySocket()
    host.gameLobbies.forEach((gameLobby) => {
      if (gameLobby.gameLobbyId == lobbyId) {
        gameLobby.playersJoined = gameLobby.playersJoined.filter(
          (player) => player.id != client.id
        )
      }
      return gameLobby
    })
    host.emitHostStateToClients()
  }

  function startGame() {
    const gameLobby = getGameLobbyBySocket()
    console.log("start game ", gameLobby.creator.name)
    const connectedClients: ConnectedClient[] = [
      gameLobby.creator,
      ...gameLobby.playersJoined,
    ].map((client) => host.connectedClients.find((c) => c.id == client.id)!)

    const playersInfo: PlayerInfo[] = connectedClients.map(({ name, id }) => ({
      name,
      id,
    }))

    const gameScenarios = gameScenariosList
    const umbrellaGame = gameScenarios.find(
      (scenario) => scenario.name == "Rain Umbrella Scenario"
    )

    const handleGameUpdate = host.emitGameUpdateToClients.bind(host)

    const test = (gameState: GameState) => {
      console.log("doink", gameState)
      handleGameUpdate(gameState)
    }

    const game =
      umbrellaGame?.createGame(playersInfo, handleGameUpdate) ??
      new Game(playersInfo, test)
    host.activeGames.push(game)
    console.log("game started")
    host.gameLobbies = host.gameLobbies.filter(
      (l) => l.gameLobbyId != gameLobby.gameLobbyId
    )
    host.emitHostStateToClients()
  }

  function setReady({ isIn }: { isIn: boolean }) {
    host.connectedClients.find((c) => {
      if (c.socket?.id == socket.id) {
        c.ready = isIn
        return true
      }
      return false
    })
    host.emitHostStateToClients()
  }

  return {
    createGameLobby,
    joinGameLobby,
    setReady,
    startGame,
    leaveLobby,
    cancelLobby,
  }

  function getClientBySocket(): ConnectedClient {
    return host.connectedClients.find(
      (client) => client.socket?.id == socket.id
    )!
  }

  function getGameLobbyBySocket(): GameLobby {
    const client = getClientBySocket()
    return host.gameLobbies.find((lobby) => lobby.creator.id == client.id)!
  }
}

export function handleSocketDisconnect({
  host,
  socket,
}: {
  host: Host
  socket: Socket
}) {
  socket.on("disconnect", () => {
    console.log("Client disconnected")
    const disconnectedClient = host.connectedClients.find(
      (client) => client.socket?.id == socket.id
    )
    if (disconnectedClient) {
      disconnectedClient.connected = false
    }

    host.connectedClients.forEach((client) => {
      console.log(
        `${client.name}: ${client.socket ? " connected" : " disconnected"}`
      )
    })
  })
}
 */
