import { useContext, useState } from "react"
import { AppContext } from "../AppContext/AppProvider"
import { ActiveGamesList_C } from "./components/ActiveGamesList"
import { ConnectedClientsList } from "./components/ConnectedClientsList"
import { GameLobbyList_C } from "./components/GameLobbyList"

export function Host_C() {
  const { setLocalName, localName, send } = useContext(AppContext)

  const [inputName, setInputName] = useState<string>()

  if (localName) {
    return (
      <div>
        <ConnectedClientsList />
        <GameLobbyList_C />
        <ActiveGamesList_C />
        <button
          onClick={() => {
            send({ name: "createGameLobby" })
          }}
        >
          Create Lobby
        </button>
      </div>
    )
  } else {
    return (
      <div>
        <input
          placeholder={"set name"}
          onInput={(e: any) => {
            console.log("e", e)
            setInputName(e.target.value)
          }}
          onKeyUp={(e) => {
            if (e.key == "Enter" && inputName) {
              localStorage.setItem("playerName", inputName)
              setLocalName(inputName)
            }
          }}
        />
      </div>
    )
  }
}
