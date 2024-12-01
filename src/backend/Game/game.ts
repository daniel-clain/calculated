import {
  FinalEvent,
  finalEventsAlgorithmItemsList,
  FinalEventState,
} from "./final-event/final-event"
import { Timer } from "./game-submodules/Timer"
import { Player, PlayerInfo, PlayerState } from "./player/player"

export class Game {
  gameId: number
  players: Player[]
  timer = new Timer()
  finalEvent = new FinalEvent({
    game: this,
    activationTime: 5000,
    algorithmItems: finalEventsAlgorithmItemsList,
  })

  constructor(
    playersInfo: PlayerInfo[],
    private handleGameUpdate: (gameState: GameState) => void
  ) {
    console.log(
      "starting game ",
      playersInfo.map((p) => p.name)
    )
    this.gameId = Date.now()
    this.players = playersInfo.map(({ name, id }) => new Player(name, id, this))
    this.setupGame()
    this.timer.start()
    this.timer.on("timeStep updated", this.processActions)
    this.triggerGameStateUpdate()
  }

  processActions() {}

  private setupGame() {}

  private getGameState(): GameState {
    return {
      gameId: this.gameId,
      finalEvent: this.finalEvent.finalEventState,
      players: this.players.map((player) => player.playerState),
      timeStep: this.timer.timeStep,
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
}

export type GameInfo = {
  gameId: number
  players: PlayerInfo[]
  currentTime: number
  timeUntilEnd: number
}
