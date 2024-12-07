import { random } from "lodash"
import { Character } from "../character/character"
import { FinalEvent } from "../final-event/final-event"
import { Game, GameState } from "../game"
import { PlayerInfo } from "../player/player"

/***the unique game identifier source of truth is here */
const scenarioNames = ["Rain Umbrella Scenario"] as const

type ScenarioName = (typeof scenarioNames)[number]

export interface Scenario {
  name: ScenarioName
}

export class RainUmbrellaScenario extends Game {
  name = "Rain UmbrellaScenario"

  protected gameSetup() {
    this.characters = this.players.map((player) => {
      const playersCharacter = new Character(
        player.name,
        random(1) ? "Good" : "Evil",
        this,
        player
      )
      player.getAssignedCharacter(playersCharacter)
      return playersCharacter
    })
    this.finalEvent = new FinalEvent({
      game: this,
      activationTime: 14000,
      finalAlgorithm: () => {
        console.log("umbrealla game has no final algorithm")
      },
    })

    this.characters.forEach((character) => {
      const randomNum = random(1)
      console.log("randomNum", randomNum)
      if (!randomNum) {
        character.items.push({ name: "umbrella" })
      }
    })

    this.worldEvents.push({
      name: "rain",
      activationTime: 8000,
      executeEvent: () => {
        console.log("executing rain event")
        this.characters.forEach((character) => {
          const umbrella = character.items.find(
            (item) => item.name == "umbrella"
          )
          if (!umbrella) {
            character.experiences.push({
              name: "rained on",
              sufferingCaused: 2,
            })
          }
        })
      },
    })
  }
}

type MapNameToGame<S extends ScenarioName> = S extends "Rain Umbrella Scenario"
  ? RainUmbrellaScenario
  : null

type ScenarioCreator = {
  name: ScenarioName
  createGame: (
    playersInfo: PlayerInfo[],
    handleGameUpdate: (gameState: GameState) => void
  ) => Game
}

export const gameScenariosList: ScenarioCreator[] = [
  {
    name: "Rain Umbrella Scenario",
    createGame: (playersInfo, handleGameUpdate) =>
      new RainUmbrellaScenario(playersInfo, handleGameUpdate),
  },
]
