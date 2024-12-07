import { useEffect, useState } from "react"
import { GameState } from "../../backend/Game/game"
import { HostState } from "../../backend/Host/host"
import { getThisClientId, getThisName } from "./setupClientLocalStorage"
import { useWebsockets } from "./useWebsockets"

const initialHostState: HostState = {
  connectedClients: [],
  gameLobbies: [],
}

export function useAppService() {
  const thisClientId = getThisClientId()
  const [localName, setLocalName] = useState<string | undefined>(getThisName())
  const [hostState, setHostState] = useState<HostState>(initialHostState)

  const [gameState, setGameState] = useState<GameState | undefined>()

  const { connected, send, connectToWebsocketServer } = useWebsockets({
    thisClientId,
    localName,
    setHostState,
    setGameState,
  })

  useEffect(() => {
    console.log(localName, connected)
    if (localName && connected) {
      if (nameIsNotSet()) {
        console.log("set name connect to host")
        connectToWebsocketServer()
      }
    }
  }, [connected, localName])

  return {
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

  function isInAGameLobby() {
    return (
      hostState.gameLobbies.some((l) => l.creator.id == thisClientId) ||
      hostState.gameLobbies.some((l) =>
        l.playersJoined?.some((p) => p.id == thisClientId)
      )
    )
  }

  function nameIsNotSet() {
    const thisClientConnectedToHost = hostState?.connectedClients.find(
      ({ id }) => id == thisClientId
    )
    return !thisClientConnectedToHost || !thisClientConnectedToHost.name
  }
}
