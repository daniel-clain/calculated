import { useContext, useState } from "react"
import { AppContext } from "../AppContext/AppProvider"
import { ConnectedClientsList } from "./components/ConnectedClientsList"
import { GameLobbyList_C } from "./components/GameLobbyList"

export function Host_C() {
  const { setLocalName, localName, send, isInAGameLobby, hostState } =
    useContext(AppContext)

  const [inputName, setInputName] = useState<string>()

  if (localName) {
    return (
      <div>
        <h3>Hello {localName}</h3>
        <hr />
        <ConnectedClientsList />
        <button
          disabled={isInAGameLobby()}
          onClick={() => {
            send({ name: "createGameLobby" })
          }}
        >
          Create Lobby
        </button>
        <GameLobbyList_C />
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
