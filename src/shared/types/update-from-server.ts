type UpdateFromServerNames = "receive game state" | "receive base state"
export interface UpdateFromServer {
  name: UpdateFromServerNames
  data: any
}
