import { FinalEvent } from "../final-event/final-event"
import { Game } from "../game"

export class FinalEventPlayerAction {
  executeAction(finalEvent: FinalEvent) {
    finalEvent.finalEventItems.push()
  }
}

class Points {
  red = 0
  blue = 0
  green = 0
  yellow = 0
}

export type PlayerInfo = {
  id: number
  name: string
}
export type PlayerState = {
  id: number
  name: string
  points: Points
}

export class Player {
  points = new Points()
  constructor(public name: string, public id: number, private game: Game) {}

  get playerState(): PlayerState {
    const { id, name, points } = this
    return {
      id,
      name,
      points,
    }
  }
}
