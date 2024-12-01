import { useContext } from "react"
import { AppContext } from "../../AppContext/AppProvider"

export function GameLobbyList_C() {
  const { hostState, thisClientId, send } = useContext(AppContext)
  return (
    <section id="game-lobby-list">
      <h3>Game Lobby List</h3>

      {hostState?.gameLobbies.map((loopGame) => (
        <div className="game-lobby" key={loopGame.gameLobbyId}>
          <div className="game-lobby__creator">
            <label>Creator </label>
            <span>{loopGame.creator.name}</span>
          </div>
          <div className="game-lobby__joined-players">
            {loopGame.playersJoined.map((loopPlayer) => (
              <div className="game-lobby__joined-player">
                {loopPlayer.name}
                {loopPlayer.id == thisClientId ? (
                  <button
                    onClick={() =>
                      send({
                        name: "setReady",
                        args: {
                          isIn: !loopPlayer.ready,
                        },
                      })
                    }
                  >
                    {loopPlayer.ready ? `✔️` : `❌`}
                  </button>
                ) : loopPlayer.ready ? (
                  `✔️`
                ) : (
                  `❌`
                )}
              </div>
            ))}
          </div>
          {loopGame.creator.id == thisClientId && (
            <button
              onClick={() => {
                send({ name: "startGame" })
              }}
            >
              Start Game
            </button>
          )}
        </div>
      ))}
    </section>
  )
}
