import { Game, GameInfo, GameState } from "../Game/game"
import { PlayerInfo } from "../Game/player/player"
import { gameScenariosList } from "../Game/scenarios/scenario"
import { ConnectedClient } from "./connected-client"
import { ClientInfo } from "./host"

export type GameLobbyInfo = {
  gameLobbyId: number
  creator: ClientInfo
  playersJoined?: ClientInfo[]
  game?: GameInfo
}

export class GameLobby {
  gameLobbyId: number
  playersJoined?: ConnectedClient[]
  game: Game | undefined

  constructor(public creator: ConnectedClient) {
    this.gameLobbyId = Date.now()
  }

  get gameLobbyInfo(): GameLobbyInfo {
    const { creator, playersJoined, game, gameLobbyId } = this
    return {
      gameLobbyId,
      creator: creator.clientInfo,
      playersJoined: playersJoined?.map((p) => p.clientInfo),
      game: game?.gameInfo,
    }
  }

  joinGameLobby(joiner: ConnectedClient) {
    console.log("joinGameLobby", joiner.name)
    if (this.playersJoined) {
      this.playersJoined.push(joiner)
    } else {
      this.playersJoined = [joiner]
    }
  }

  setReady(ready: boolean, player: ConnectedClient) {
    this.playersJoined?.some((p) => {
      if (p.id == player.id) {
        p.ready = ready
        return true
      }
      return false
    })
  }

  leaveGameLobby(leaver: ConnectedClient) {
    console.log("leaveGameLobby", leaver.name)
    this.playersJoined = this.playersJoined?.filter(
      (player) => player.id != leaver.id
    )
  }

  startGame() {
    const gameScenarios = gameScenariosList
    const umbrellaGame = gameScenarios.find(
      (scenario) => scenario.name == "Rain Umbrella Scenario"
    )

    const playersInfo: PlayerInfo[] = [
      this.creator,
      ...(this.playersJoined ? this.playersJoined : []),
    ].map(({ id, name }) => ({ id, name }))

    const handleGameUpdate = (gameState: GameState) => {
      console.log("handle game update")
      if (gameState.players.some((p) => p.points)) {
        console.log("5 secs until game delete")
        setTimeout(() => {
          delete this.game
          this.getAllGameClients().forEach(({ socket }) => {
            socket.emit("gameStateUpdate", undefined)
          })
        }, 5000)
      }
      this.getAllGameClients().forEach(({ socket }) => {
        socket.emit("gameStateUpdate", gameState)
      })
    }

    const game =
      umbrellaGame?.createGame(playersInfo, handleGameUpdate) ??
      new Game(playersInfo, handleGameUpdate)
    console.log("game started")

    this.game = game
  }

  private getAllGameClients() {
    return [this.creator, ...(this.playersJoined ? this.playersJoined : [])]
  }
}
