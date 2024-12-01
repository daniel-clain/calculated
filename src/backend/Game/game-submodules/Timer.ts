import EventEmitter from "events"

const gameTimeStepIncrement = 10

export class Timer extends EventEmitter {
  private _timeStep = 0
  private intervalRef: NodeJS.Timeout | undefined
  private _paused = true

  start() {
    this.intervalRef = setInterval(() => {
      this.timeStep += gameTimeStepIncrement
    }, gameTimeStepIncrement)
  }

  get timeStep() {
    return this._timeStep
  }
  set timeStep(val: typeof this._timeStep) {
    this._timeStep = val
    this.emit("timeStep updated")
  }

  pause() {
    this.paused = true
  }
  unpause() {
    this.paused = false
  }

  get paused() {
    return this._paused
  }

  set paused(val: typeof this._paused) {
    this._paused = val
    if (this._paused) {
      clearInterval(this.intervalRef)
    } else {
      this.start()
    }
  }
}