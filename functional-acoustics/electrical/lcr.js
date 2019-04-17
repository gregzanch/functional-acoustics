function seriesResonator({ f, B, L, C, R } = {}) {
    if (f && B) {
        const w = 2 * Math.PI * f;
        const _C = C ? C : ({ R, L } = {}) => L ? (1 / (L * w * w)) : (R ? (2 * Math.PI * B) / (R * w * w) : undefined);
        const _L = L ? L : ({ R, C } = {}) => R ? (R / (2 * Math.PI * B)) : (C ? 1 / (C * w * w) : undefined);
        const _R = R ? R : ({ L, C } = {}) => L ? (2 * Math.PI * L * B) : (C ? (2 * Math.PI * B) / (C * w * w) : undefined);
        return {
            L: L ? L : (C ? _L({ C }) : (R ? _L({ R }) : _L)),
            C: C ? C : (R ? _C({ R }) : (L ? _C({ L }) : _C)),
            R: R ? R : (L ? _R({ L }) : (C ? _R({ C }) : _R))
        }
    }
    else{
        console.error('need more info');
    }
}

export { seriesResonator }