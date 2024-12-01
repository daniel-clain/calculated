import { useContext } from "react"
import { AppContext } from "../../AppContext/AppProvider"

export function ConnectedClientsList() {
  const { hostState } = useContext(AppContext)
  if (!hostState) return null
  return (
    <div>
      <h3>Connected Clients</h3>
      <ul>
        {hostState?.connectedClients.map((currentClient) => (
          <li key={currentClient.id}>{currentClient.name}</li>
        ))}
      </ul>
      <hr />
    </div>
  )
}
