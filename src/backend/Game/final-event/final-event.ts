import { Subject } from "rxjs"
import { Game } from "../game"

type AlgorithmItemProps = {
  createdFinalEventItems?: FinalEventItem[]
  condition: Condition
  effect: Effect
}

export class AlgorithmItem {
  condition?: Condition
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
      condition: condition?.description,
      effect: effect.description,
    }
  }
}

type AlgorithmItemState = {
  condition?: string
  effect: string
}

export class FinalEventItem {
  constructor(public name: string) {}
}

export class Condition {
  constructor(
    public check: (game: Game) => boolean,
    public description: string
  ) {}
}

export class Effect {
  constructor(public apply: (game: Game) => void, public description: string) {}
}

type FinalEventProps = {
  game: Game
  activationTime: number
  finalAlgorithm: () => void
}

export type FinalEventState = {
  activationTime: number
}

export class FinalEvent implements FinalEventState {
  private game: Game
  activationTime: number
  finalAlgorithm: () => void
  completed: Subject<void> = new Subject()

  constructor(finalEventProps: FinalEventProps) {
    const { game, activationTime, finalAlgorithm } = finalEventProps
    this.game = game
    this.activationTime = activationTime
    this.finalAlgorithm = finalAlgorithm
    game.timer.on("timeStep updated", () => {
      if (game.timer.timeStep == this.activationTime) {
        this.runFinalAlgorithm()
      }
    })
  }

  onActivationTimeExpire(functionToRun: () => void) {
    functionToRun()
  }

  runFinalAlgorithm() {
    console.log("running final algorithm")
    this.finalAlgorithm()
    this.completed.next()
  }
  get state(): FinalEventState {
    const { activationTime } = this
    return {
      activationTime,
    }
  }
}

export const finalEventsAlgorithmItemsList: AlgorithmItem[] = []
