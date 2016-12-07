/**
 * Created by wolfman on 16-12-7.
 */

module.exports = class SimpleEventEmitter {
  constructor(){
    this.__events__ = {}
  }
  addListener(event, listener){
    if (!Array.isArray(this.__events__[event]))
      this.__events__[event] = []
    this.__events__[event].push(listener)
    return this
  }
  addOnceListener(event, listener){
    const once_listener = () => {
      listener.apply(this)
      this.removeListener(event, once_listener)
    }
    once_listener.source = listener
    return this.addListener(event, once_listener)
  }
  removeListener(event, listener){
    if (!event) {
      this.__events__ = {}
    } else if (!listener && !!this.__events__[event]) {
      this.__events__[event] = []
    } else {
      this.__events__[event] = this.__events__[event].filter(l => l === listener || l.source === listener)
    }
    return this
  }
  emitEvent(event, args){
    const listeners = this.__events__[event] || []
    listeners.forEach(listener => {
      listener.apply(this, args)
    })
    return this
  }
  emit(event, ...args){ return this.emitEvent(event, args) }
  on(...arg){ return this.addListener(...arg) }
  off(...arg){ return this.removeListener(...arg) }
  once(...arg){ return this.addOnceListener(...arg) }
  trigger(...arg){ return this.emitEvent(...arg) }
}

