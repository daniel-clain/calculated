import { useContext, useEffect, useRef, useState } from "react"
import { GameContext } from "../../GameContext/GameProvider"

export function Time_C() {
  const {
    gameState: { timeStep },
  } = useContext(GameContext)
  const [time, setTime] = useState(getTime())
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    clearExistingInterval()
    setTime(getTime())
    timeIntervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1)
    }, 1000)
    return clearExistingInterval
  }, [timeStep])

  return <h3>Time: {time}</h3>

  function getTime() {
    return Math.round(timeStep / 1000)
  }

  function clearExistingInterval() {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current)
      timeIntervalRef.current = null
    }
  }
}
