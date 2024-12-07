import { Game } from "../../game"
import { AlgorithmItem, Condition, Effect } from "../final-event"
export const ifSquareThenPoints = new AlgorithmItem({
  condition: new Condition((game: Game) => {
    return game.finalEvent.finalEventItems.some((item) => item.name == "square")
  }, "if final event items include square"),
  effect: new Effect((game: Game) => {},
  "give all players 5 blue points and 2 red points"),
})
