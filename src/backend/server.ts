import express from "express"
import http from "http"
import path from "path"
import "./Host/host"
import { Host } from "./Host/host"
/* 
exposeFrontendApp({
  relativePathToBuild: "../../build",
  port: 4000,
}) */

const expressApp = express()
const server = http.createServer(expressApp)

const pathToBuild = path.join(__dirname, "../../build")
expressApp.use(express.static(pathToBuild))

const port = 4000
server.listen(port, () => console.log(`Server running on port ${port}`))

new Host(server)
