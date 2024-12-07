import { Dispatch, useState } from "react"
import { io, Socket } from "socket.io-client"
import { GameState } from "../../backend/Game/game"
import { HostState } from "../../backend/Host/host"
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../shared/types/message-to-server"
import { loopObject } from "../../shared/utils/helper-functions"

const envurl = process.env.REACT_APP_WEBSOCKET_URL
console.log("envurl", envurl)

export const serverToClientEvents = {}

export type GameSocketClient = Socket<
  ServerToClientEvents,
  ClientToServerEvents
>

type Props = {
  thisClientId: number
  localName?: string
  setHostState: Dispatch<HostState>
  setGameState: Dispatch<GameState | undefined>
}
export function useWebsockets({
  thisClientId,
  localName,
  setHostState,
  setGameState,
}: Props) {
  const [connected, setConnected] = useState(false)

  const [socket, setSocket] = useState<GameSocketClient | null>(null)

  function connectToWebsocketServer() {
    console.log("Creating socket connection...")
    const newSocket: GameSocketClient = io(`http://${envurl}`, {
      query: { id: thisClientId, name: localName },
    })
    setSocket(newSocket)
    return newSocket
  }

  socket?.on("connect", () => {
    console.log("Connected to WebSocket server")

    const clientToServerEvents = handleServerToClient(
      setHostState,
      setGameState
    )

    loopObject(clientToServerEvents, (eventName) => {
      socket.on(eventName, clientToServerEvents[eventName])
    })

    setConnected(true)
  })
  socket?.on("connect_error", (error: any) => {
    console.error("Connection failed:", error)

    setConnected(false)
  })

  function send({ name, args }: any) {
    console.log(name, args)
    socket?.emit(name, args)
  }

  return {
    connected,
    send,
    connectToWebsocketServer,
  }
}

export function handleServerToClient(
  setHostState: Dispatch<HostState>,
  setGameState: Dispatch<GameState | undefined>
) {
  function hostStateUpdate(hostState: HostState) {
    setHostState(hostState)
  }
  function gameStateUpdate(gameState: GameState | undefined) {
    setGameState(gameState)
  }

  return {
    hostStateUpdate,
    gameStateUpdate,
  }
}
