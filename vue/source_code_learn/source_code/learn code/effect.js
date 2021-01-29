function effect (fn) {
    effect.activeEffect = fn;
    fn()
}
effect.activeEffect = null

module.exports = effect