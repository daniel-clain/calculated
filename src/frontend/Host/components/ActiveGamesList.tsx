import { useContext } from "react"
import { AppContext } from "../../AppContext/AppProvider"

export function ActiveGamesList_C() {
  const { hostState } = useContext(AppContext)
  return (
    <div>
      <h3>Acitve Games</h3>
      {hostState?.activeGames.map((game) => (
        <div key={game.gameId}>
          {game.players.map(({ name, id }) => (
            <div key={id}>{name}</div>
          ))}
        </div>
      ))}
    </div>
  )
}
