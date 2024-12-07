import { useContext } from "react"
import { GameContext } from "../GameContext/GameProvider"
import { Time_C } from "./game-subcomponents/Time"

export function Game_C() {
  const { gameState, localTimeStep } = useContext(GameContext)

  return (
    <div>
      <Time_C />
      <div>
        <h3>Final Event</h3>
        {`\n\t- the final event will activate at ${
          gameState.finalEvent.activationTime
        } (${gameState.finalEvent.activationTime / 1000 - localTimeStep})`}
      </div>
      <div>
        <h3>World Events</h3>
        {gameState.worldEvents.map(
          (event) =>
            `\n\t- it will ${event.name} at ${event.activationTime} (${
              event.activationTime / 1000 - localTimeStep
            })`
        )}
      </div>
      <h3>Players:</h3>
      {gameState.players.map((player) => {
        const playersCharacter = player.character
        return (
          <div
            style={{
              padding: 20,
              backgroundColor: "#e7feff",
              borderTop: "solid black 1p",
            }}
          >
            <div>Name: {player.name}</div>
            {playersCharacter && (
              <div style={{ whiteSpace: "pre-wrap" }}>
                Character:{" "}
                {`\n\t - allignment: ${
                  playersCharacter?.alignment
                }\n\t - items: ${playersCharacter?.items
                  .map((i) => i.name)
                  .join(
                    ", "
                  )}\n\t - experiences ${playersCharacter?.experiences.map(
                  (e) =>
                    `\n\t\t ~ name ${e.name}\n\t\t ~ suffering${e.sufferingCaused}`
                )}`}
              </div>
            )}
          </div>
        )
      })}
      {gameState.players.some((p) => p.points != undefined) && (
        <div>
          <h3>Final Points</h3>
          {gameState.players.map((player) => {
            return (
              <div
                style={{
                  padding: 20,
                  backgroundColor: "#fcd7ff",
                  borderTop: "solid black 1p",
                }}
              >
                <div>Name: {player.name}</div>
                <div style={{ whiteSpace: "pre-wrap" }}>
                  Points: {player.points}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* <h3>Algorithm Items:</h3>
      {gameState.finalEvent.algorithmItems.map((algorithmItems) => (
        <div>
          <div>Condition: {algorithmItems.condition}</div>
          <div>Effect: {algorithmItems.effect}</div>
        </div>
      ))} */}
    </div>
  )
}
