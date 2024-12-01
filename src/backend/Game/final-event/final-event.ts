import { Game } from "../game"
import { FinalEventPlayerAction } from "../player/player"

type AlgorithmItemProps = {
  createdFinalEventItems?: FinalEventItem[]
  condition: Condition
  effect: Effect
}

export class AlgorithmItem {
  condition: Condition
  effect: Effect
  createdFinalEventItems?: FinalEventItem[]

  constructor({
    createdFinalEventItems,
    condition,
    effect,
  }: AlgorithmItemProps) {
    this.createdFinalEventItems = createdFinalEventItems
    this.condition = condition
    this.effect = effect
  }

  get algorithmItemState(): AlgorithmItemState {
    const { condition, effect } = this
    return {
      condition: condition.description,
      effect: effect.description,
    }
  }
}

type AlgorithmItemState = {
  condition: string
  effect: string
}

class Condition {
  constructor(
    public check: (game: Game) => boolean,
    public description: string
  ) {}
}

class Effect {
  constructor(public apply: (game: Game) => void, public description: string) {}
}

export class FinalEventItem {
  constructor(public name: string) {}
}

export type FinalEventState = {
  algorithmItems: AlgorithmItemState[]
}
type FinalEventProps = {
  game: Game
  activationTime: 5000
  algorithmItems: AlgorithmItem[]
}
export class FinalEvent {
  private game: Game
  activationTime: number
  playerActions: FinalEventPlayerAction[] = []
  algorithmItems: AlgorithmItem[] = []
  finalEventItems: FinalEventItem[] = []
  constructor(finalEventProps: FinalEventProps) {
    const { game, activationTime, algorithmItems } = finalEventProps
    this.game = game
    this.activationTime = activationTime
    this.algorithmItems = algorithmItems
  }

  get finalEventState(): FinalEventState {
    const { algorithmItems } = this
    return {
      algorithmItems: algorithmItems.map((item) => item.algorithmItemState),
    }
  }
  runAlgorithm() {
    this.playerActions.forEach((action) => {})
    this.algorithmItems.forEach((item) => {
      if (item.condition.check(this.game)) {
        item.effect.apply(this.game)
      }
    })
  }
}

const ifSquareThenPoints = new AlgorithmItem({
  condition: new Condition((game: Game) => {
    return game.finalEvent.finalEventItems.some((item) => item.name == "square")
  }, "if final event items include square"),
  effect: new Effect((game: Game) => {},
  "give all players 5 blue points and 2 red points"),
})

export const finalEventsAlgorithmItemsList: AlgorithmItem[] = [
  ifSquareThenPoints,
]
