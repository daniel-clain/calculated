import { Character } from "./character/character"
import { WorldEvent } from "./event/event"
import { FinalEvent, FinalEventState } from "./final-event/final-event"
import { Timer } from "./game-submodules/Timer"
import { Player, PlayerInfo, PlayerState } from "./player/player"

const defaultFinalEvent = {} as FinalEvent
export class Game {
  gameId: number
  players: Player[]
  characters: Character[] = []
  timer = new Timer()
  finalEvent: FinalEvent = defaultFinalEvent
  worldEvents: WorldEvent[] = []

  constructor(
    playersInfo: PlayerInfo[],
    private handleGameUpdate: (gameState: GameState) => void
  ) {
    this.gameId = Date.now()
    this.players = playersInfo.map(({ name, id }) => new Player(name, id, this))
    this.gameSetup()
    this.gameStart()
    this.finalEvent.completed.subscribe(() => {
      console.log("final event completed")
      this.gameOver()
    })
  }

  get gameInfo(): GameInfo {
    return {
      gameId: this.gameId,
      currentTime: this.timer.timeStep,
      players: this.players.map((p) => p.playerInfo),
      timeUntilEnd: this.finalEvent.activationTime - this.timer.timeStep,
    }
  }

  private gameStart() {
    console.log(
      "starting game ",
      this.players.map((p) => p.name)
    )
    this.timer.start()
    this.timer.on("timeStep updated", this.onTimeUpdate.bind(this))
    this.triggerGameStateUpdate()
  }

  private onTimeUpdate() {
    this.processActions()
    this.checkEvents()
  }

  protected gameSetup() {
    // trumped in scenario
  }

  private processActions() {}

  private checkEvents() {
    this.worldEvents = this.worldEvents.filter((event) => {
      if (event.activationTime <= this.timer.timeStep) {
        console.log("executing event")
        event.executeEvent()

        this.triggerGameStateUpdate()
        return false
      }
      return true
    })
  }

  private gameOver() {
    this.timer.off("timeStep updated", this.onTimeUpdate)
    this.calculateTheTotalPoints()
    this.triggerGameStateUpdate()
  }

  getCharactersSuffering(character: Character) {
    return character.experiences.reduce((charactersSuffering, experience) => {
      return charactersSuffering + experience.sufferingCaused
    }, 0)
  }

  private calculateTheTotalPoints() {
    console.log("calculating points")
    const globalSuffereing = this.characters.reduce(
      (globalSuffering, character) => {
        return globalSuffering + this.getCharactersSuffering(character)
      },
      0
    )
    console.log("globalSuffereing", globalSuffereing)

    this.players.forEach((player) => {
      const playerCharactersSuffering = this.getCharactersSuffering(
        player.character!
      )

      const playerPoints =
        player.character!.alignment == "Evil"
          ? globalSuffereing -
            playerCharactersSuffering -
            playerCharactersSuffering
          : -globalSuffereing - playerCharactersSuffering

      player.getAwardPoints(playerPoints)
    })
  }

  private getGameState(): GameState {
    return {
      gameId: this.gameId,
      finalEvent: this.finalEvent.state,
      players: this.players.map((player) => player.playerState),
      timeStep: this.timer.timeStep,
      worldEvents: this.worldEvents,
    }
  }

  handlePlayerReconnected(playerId: number) {
    const player = this.players.find((player) => player.id == playerId)
    if (player) {
      console.log(`${player.name} has reconnected`)
    }
  }

  triggerGameStateUpdate() {
    console.log("sending update")
    this.handleGameUpdate(this.getGameState())
    //update the gameState for each client with currentGameState
  }
}

export type GameState = {
  gameId: number
  finalEvent: FinalEventState
  players: PlayerState[]
  timeStep: number
  worldEvents: WorldEvent[]
}

export type GameInfo = {
  gameId: number
  players: PlayerInfo[]
  currentTime: number
  timeUntilEnd: number
}
