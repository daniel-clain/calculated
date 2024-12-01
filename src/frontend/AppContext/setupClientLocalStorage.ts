export function getThisClientId(): number {
  let id = Number(localStorage.getItem("playerId"))
  if (!id) {
    id = Date.now()
    localStorage.setItem("playerId", id.toString())
  }
  return id
}

export function getThisName(): string | undefined {
  return localStorage.getItem("playerName") ?? undefined
}
