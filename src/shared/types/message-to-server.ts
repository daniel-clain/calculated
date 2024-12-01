import { handleSocketMessages } from "../../backend/Host/socket-events"
export type ServerFunctions = ReturnType<typeof handleSocketMessages>

export type ServerFunctionNames = keyof ServerFunctions

export type GetServerFunctionArgs<Name extends ServerFunctionNames> =
  Parameters<ServerFunctions[Name]>[0]

export type MessagesToServer<Name extends ServerFunctionNames> = {
  name: Name
  args?: GetServerFunctionArgs<Name>
}
const startGameMessage: MessagesToServer<"startGame"> = {
  name: "startGame",
  args: undefined,
}

const setInForNextGameMessage: MessagesToServer<"setReady"> = {
  name: "setReady",
  args: { isIn: true },
}

const message: MessagesToServer<ServerFunctionNames> = {
  name: "joinGameLobby",
  args: undefined,
}
