class EventsInterface {
  constructor() {
    this._listeners = new Map()
  }

  addListener(name, callback) {
    this._listeners.has(name) || this._listeners.set(name, [])
    this._listeners.get(name).unshift(callback)
  }

  removeListener(name, callback) {
    if (this._listeners.has(name)) {
      let listeners = this._listeners.get(name)
      listeners = listeners.filter(listener => {
        listener !== callback
      })
      this._listeners.set(name, listeners)
    }
  }

  dispatch(name, ...args) {
    if (this._listeners.has(name)) {
      const listeners = this._listeners.get(name)
      listeners.forEach(listener => {
        listener.apply(this, args)
      })
    }
  }
}

export default EventsInterface
