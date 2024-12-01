import { Socket } from "socket.io"
import {
  MessagesToServer,
  ServerFunctionNames,
} from "../../shared/types/message-to-server"
import { ClientInfo, Host, HostState } from "./host"
import { handleSocketMessages } from "./socket-events"

export class PendingClient {
  constructor(private host: Host, public socket: Socket) {
    console.log("--pending client")
    socket.on("connectToHost", ({ id, name }: ClientInfo) => {
      this.host.registerClient(id, name, this.socket)
    })
    socket.on("disconnect", this.handleDisconnect.bind(this))
  }

  private handleDisconnect() {
    console.log("Pending client disconnected")
    this.host.pendingClients = this.host.pendingClients.filter(
      (client) => client.socket !== this.socket
    )
  }
}

export class ConnectedClient {
  connected = true
  ready: boolean = false

  constructor(
    public host: Host,
    public id: number,
    public name: string,
    public socket: Socket
  ) {
    console.log("--connected client")
    const funcs = handleSocketMessages({ host: this.host, socket })
    socket.on(
      "message",
      <Name extends ServerFunctionNames>(message: MessagesToServer<Name>) => {
        const { name, args } = message
        console.log("received", name, args)
        funcs[name](args as any)
      }
    )
    socket.on("disconnect", this.handleDisconnect.bind(this))
  }

  private handleDisconnect() {
    console.log(`Client disconnected: ${this.name} (${this.id})`)
    this.connected = false
    // Logic for handling disconnection from the host
  }

  emitdHostState(hostState: HostState) {
    this.socket.emit("HostState", hostState)
  }
}
