import EventsInterface from './events-interface'

@Reflect.metadata('instance', true)
class BaseInstance extends EventsInterface {
  setRuntime(runtime) {
    this._runtime = runtime
    this._runtime.addInstance(this)
  }
}

export default BaseInstance
