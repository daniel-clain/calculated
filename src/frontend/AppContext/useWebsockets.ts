import { useEffect, useState } from "react"
import socketIOClient from "socket.io-client"
import { GameState } from "../../backend/Game/game"
import { ClientInfo, HostState } from "../../backend/Host/host"
import {
  MessagesToServer,
  ServerFunctionNames,
} from "../../shared/types/message-to-server"

const envurl = process.env.REACT_APP_WEBSOCKET_URL
console.log("envurl", envurl)
const socket = socketIOClient(`http://${envurl}`)

export function useWebsockets() {
  const [hostState, setHostState] = useState<HostState>()
  const [gameState, setGameState] = useState<GameState>()

  const [connected, setConnected] = useState(false)


  socket.on("connect", () => {
    console.log("Connected to WebSocket server")
    setConnected(true)

    socket.on("HostState", (bs: HostState) => {
      console.log("HostState received from server:", bs)
      setHostState(bs)
    })

    socket.on<"GameState">("GameState", (gs: GameState) => {
      console.log("gameState received from server:", gs)
      setGameState(gs)
    })
  })
  socket.on("connect_error", (error: any) => {
    console.error("Connection failed:", error)

    setConnected(false)
  })

  function send<T extends ServerFunctionNames>({
    name,
    args,
  }: MessagesToServer<T>) {
    console.log(name, args)
    socket?.send({ name, args })
  }

  function connectToHost(clientInfo: ClientInfo) {
    socket.emit("connectToHost", clientInfo)
  }

  return { hostState, gameState, connected, connectToHost, send }
}
