import { Game } from "../game"
import { PlayerInfo } from "../player/player"
type Alignment = "Good" | "Evil"
type Experience = {
  name: string
  sufferingCaused: number
}
type Item = { name: string }
type Belief = {}
type Information = {}
type Employee = {}
type Knowledge = {}

interface HasAlignment {
  alignment: Alignment
}
interface HasExperiences {
  experiences: Experience[]
}
interface HasEmployees {
  employees: Employee[]
}
interface HasKnowledge {
  knowledge: Knowledge[]
}
interface HasInformation {
  information: Information[]
}

interface HasItems {
  items: Item[]
}

interface HasBeliefs {
  beliefs: Belief[]
  getANewBelief(belief: Belief): void
}
interface HasMoney {
  money: number
}

export type CharacterProps = Partial<
  Pick<
    Character,
    | "beliefs"
    | "employees"
    | "money"
    | "items"
    | "experiences"
    | "information"
    | "knowledge"
  >
>

export type CharacterState = Pick<
  Character,
  | "alignment"
  | "beliefs"
  | "employees"
  | "experiences"
  | "information"
  | "items"
  | "knowledge"
  | "money"
  | "name"
  | "player"
>
export class Character
  implements
    HasBeliefs,
    HasExperiences,
    HasMoney,
    HasKnowledge,
    HasItems,
    HasInformation,
    HasAlignment,
    HasEmployees
{
  getANewBelief(belief: Belief): void {
    this.beliefs.push(belief)
  }
  beliefs: Belief[]
  experiences: Experience[]
  money: number
  knowledge: Knowledge[]
  items: Item[]
  information: Information[]
  employees: Employee[]

  constructor(
    public name: string,
    public alignment: Alignment,
    private game: Game,
    public player?: PlayerInfo,
    options?: CharacterProps
  ) {
    this.beliefs = options?.beliefs ?? []
    this.experiences = options?.experiences ?? []
    this.money = options?.money ?? 500
    this.information = options?.information ?? []
    this.items = options?.items ?? []
    this.employees = options?.employees ?? []
    this.knowledge = options?.knowledge ?? []
  }

  get characterState(): CharacterState {
    const {
      items,
      name,
      money,
      knowledge,
      employees,
      information,
      beliefs,
      experiences,
      alignment,
    } = this
    const characterState: CharacterState = {
      items,
      name,
      money,
      knowledge,
      employees,
      information,
      beliefs,
      experiences,
      alignment,
    }
    return characterState
  }
}
