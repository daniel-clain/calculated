import { loopObject } from "../../shared/utils/helper-functions"
import { GameLobby } from "./game-lobby"
import { ClientInfo, GameSocket, Host } from "./host"

type Props = { host: Host; socket: GameSocket } & ClientInfo
export class ConnectedClient implements ClientInfo {
  private host: Host

  id: number
  name: string
  ready?: boolean | undefined
  socket: GameSocket

  constructor({ host, socket, id, name }: Props) {
    this.host = host
    this.host.connectedClients.push(this)
    this.socket = socket
    this.id = id
    this.name = name
    const clientToServerEvents = handleClientToServerEvents(host, this)

    loopObject(clientToServerEvents, (eventName) => {
      socket.on(eventName, (args: any) => {
        console.log("eventName", eventName)
        const func = clientToServerEvents[eventName] as any
        func(args)
      })
    })
  }

  get clientInfo(): ClientInfo {
    const { id, name, ready } = this
    return { id, name, ready }
  }
}

export function handleClientToServerEvents(
  host: Host,
  socketConnection: ConnectedClient
) {
  function createGameLobby() {
    console.log("createGameLobby", socketConnection.name)
    host.gameLobbies.push(new GameLobby(socketConnection))
    host.emitHostState()
  }

  function joinGameLobby(lobbyId: number) {
    console.log("joinGameLobby", socketConnection.name)
    if (
      !host.gameLobbies
        .find((lobby) => lobby.gameLobbyId == lobbyId)
        ?.joinGameLobby(socketConnection)
    ) {
      console.log("should have found game to join", lobbyId)
    }

    host.emitHostState()
  }

  function setReady(ready: boolean) {
    console.log("setReady", socketConnection.name)
    if (
      !host.gameLobbies
        .find((lobby) =>
          lobby.playersJoined?.some(
            (player) => player.id == socketConnection.id
          )
        )
        ?.setReady(ready, socketConnection)
    ) {
      console.log(
        "should have found player in lobby for ready check",
        socketConnection.name
      )
    }
    host.emitHostState()
  }

  function leaveGameLobby() {
    console.log("leaveGameLobby", socketConnection.name)
    host.gameLobbies.some((lobby) => {
      const foundClient = lobby.playersJoined?.find(
        (p) => p.id == socketConnection.id
      )
      if (!foundClient) return false
      lobby.playersJoined = lobby.playersJoined?.filter(
        (p) => p.id != foundClient.id
      )
      return true
    })
    host.emitHostState()
  }

  function closeGameLobby() {
    console.log("closeGameLobby", socketConnection.name)
    host.gameLobbies = host.gameLobbies.filter((lobby) => {
      return lobby.creator.id != socketConnection.id
    })
    host.emitHostState()
  }

  function startGame() {
    if (
      !host.gameLobbies
        .find((lobby) => lobby.creator.id == socketConnection.id)
        ?.startGame()
    ) {
    }

    host.emitHostState()
  }

  return {
    createGameLobby,
    joinGameLobby,
    setReady,
    leaveGameLobby,
    closeGameLobby,
    startGame,
  }
}
