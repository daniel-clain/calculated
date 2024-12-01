import { useEffect, useState } from "react"
import { getThisClientId, getThisName } from "./setupClientLocalStorage"
import { useWebsockets } from "./useWebsockets"

export function useAppService() {
  const thisClientId = getThisClientId()
  const [localName, setLocalName] = useState<string | undefined>(getThisName())

  const { connected, send, hostState, gameState, connectToHost } =
    useWebsockets()

  useEffect(() => {
    console.log(localName, connected)
    if (localName && connected) {
      if (nameIsNotSet()) {
        console.log("set name connect to host")
        connectToHost({ id: thisClientId, name: localName })
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
  }

  function nameIsNotSet() {
    const thisClientConnectedToHost = hostState?.connectedClients.find(
      ({ id }) => id == thisClientId
    )
    return !thisClientConnectedToHost || !thisClientConnectedToHost.name
  }
}
