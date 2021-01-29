const effect = require('./effect.js');

 class Desp {
    constructor() {
        this.subs = new Set()
    }

    depend() {
        if(effect.activeEffect) {
            this.subs.add(effect.activeEffect)
        }
    }

    notify() {
        this.subs.forEach(effect => effect())
    }
}

console.log(Desp)

module.exports = Desp