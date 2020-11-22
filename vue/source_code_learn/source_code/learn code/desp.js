import { effect } from './effect.js';

export class Desp {
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