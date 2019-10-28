class EventBus {
  constructor() {
    this.events = {};
  }

  on(name, callback) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(callback);
  }

  emit(name, ...args) {
    const functions = this.events[name];
    if (functions) {
      for (let i = 0; i < functions.length; i++) {
        const fn = functions[i];
        fn(...args);
      }
    }
  }

  off(name, callback) {
    const functions = this.events[name];
    if (functions) {
      const index = functions.indexOf(callback);
      if (index > -1) {
        functions.splice(index, 1);
      }
    }
  }

  once(name, cb) {
    const wrapper = (...args) => {
      cb(...args);
      this.off(name, wrapper);
    };
    this.on(name, wrapper);
  }
}

export default EventBus;
