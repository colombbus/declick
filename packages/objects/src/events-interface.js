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
      if (callback) {
        let listeners = this._listeners.get(name)
        listeners = listeners.filter(listener => {
          return listener !== callback
        })
        this._listeners.set(name, listeners)
      } else {
        this._listeners.delete(name)
      }
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
