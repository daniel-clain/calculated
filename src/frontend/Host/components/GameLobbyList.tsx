import { useContext } from "react"
import { AppContext } from "../../AppContext/AppProvider"

export function GameLobbyList_C() {
  const { hostState, thisClientId, send } = useContext(AppContext)

  const notInAnotherLobby = hostState.gameLobbies.some(
    (game) =>
      game.creator.id != thisClientId &&
      !game.playersJoined?.some((player) => player.id == thisClientId)
  )
  return (
    <section id="game-lobby-list">
      <h3>Game Lobby List</h3>

      {hostState?.gameLobbies.map((gameLobby) => {
        const thisIsCreator = gameLobby.creator.id == thisClientId
        const thisHasJoined = gameLobby.playersJoined?.some(
          (p) => p.id == thisClientId
        )
        return (
          <div className="game-lobby" key={gameLobby.gameLobbyId}>
            <div className="game-lobby__creator">
              <label>Creator </label>
              <span>{gameLobby.creator.name}</span>
            </div>
            {gameLobby.game && (
              <div>
                <label>In Game </label>
                <span>{!!gameLobby.game}</span>
              </div>
            )}
            {notInAnotherLobby && (
              <div className="game-lobby__join-button">
                <button
                  onClick={() => {
                    send<"joinGameLobby">({
                      name: "joinGameLobby",
                      args: gameLobby.gameLobbyId,
                    })
                  }}
                >
                  Join
                </button>
              </div>
            )}
            {thisIsCreator && (
              <div className="game-lobby__cancel-button">
                <button
                  onClick={() => {
                    send<"closeGameLobby">({
                      name: "closeGameLobby",
                    })
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
            {thisHasJoined && (
              <div className="game-lobby__leave-button">
                <button
                  disabled={gameLobby.playersJoined?.find((p) => p.id)?.ready}
                  onClick={() => {
                    send<"leaveGameLobby">({
                      name: "leaveGameLobby",
                    })
                  }}
                >
                  Leave
                </button>
              </div>
            )}
            <div className="game-lobby__joined-players">
              {gameLobby.playersJoined?.map((loopPlayer) => (
                <div className="game-lobby__joined-player">
                  {loopPlayer.name}
                  {loopPlayer.id == thisClientId ? (
                    <button
                      onClick={() =>
                        send({
                          name: "setReady",
                          args: !loopPlayer.ready,
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
            {gameLobby.creator.id == thisClientId && (
              <button
                disabled={!gameLobby.playersJoined?.length}
                onClick={() => {
                  send({ name: "startGame" })
                }}
              >
                Start Game
              </button>
            )}
          </div>
        )
      })}
      <hr />
    </section>
  )
}
