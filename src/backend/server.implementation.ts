import express from "express"
import http from "http"
import path from "path"
import { Server } from "socket.io"

console.log("-- server imp")
const expressApp = express()
const server = http.createServer(expressApp)
export const websocketServer = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow connections from your React app
    methods: ["GET", "POST"],
    credentials: true,
  },
})

export function exposeFrontendApp({
  relativePathToBuild,
  port,
}: {
  relativePathToBuild: string
  port: number
}) {
  const pathToBuild = path.join(__dirname, relativePathToBuild)
  expressApp.use(express.static(pathToBuild))
  server.listen(port, () => console.log(`Server running on port ${port}`))
}
