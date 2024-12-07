import { Character, CharacterState } from "../character/character"
import { Game } from "../game"

class Points {
  red = 0
  blue = 0
  green = 0
  yellow = 0
}

export type PlayerInfo = {
  id: number
  name: string
  points?: number
}
export type PlayerState = {
  id: number
  name: string
  points: number
  character?: CharacterState
}
type CanHaveACharacter = {
  character?: Character
}
type HasPoints = {
  points: number
}
export class Player implements CanHaveACharacter, HasPoints {
  private _points = 0
  private _character?: Character
  constructor(public name: string, public id: number, private game: Game) {}

  get playerInfo(): PlayerInfo {
    return {
      id: this.id,
      name: this.name,
      points: this.points,
    }
  }

  get character() {
    return this._character
  }
  get points() {
    return this._points
  }

  get playerState(): PlayerState {
    const { id, name, points, character } = this
    return {
      id,
      name,
      points,
      character: character?.characterState,
    }
  }
  getAssignedCharacter(character: Character) {
    character.player = this
    this._character = character
  }
  getAwardPoints(points: number) {
    console.log(`${this.name} was awarded ${points} points`)
    this._points += points
  }
}
