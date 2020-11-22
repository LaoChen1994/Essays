export function effect (fn) {
    effect.activeEffect = fn;
    fn()
}

effect.activeEffect = null