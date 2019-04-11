export function numarrayfunction(v, f) {
    if (Number.isFinite(v)) {
        return f(v);
    }
    else if (v instanceof Array) {
        return v.map(x => f(x));
    }
}