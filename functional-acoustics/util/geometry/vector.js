import sum from '../sum';

const vec4 = (x, y, z, t) => {
    return { x, y, z, t }
};
const vec3 = (x, y, z) => {
    return { x, y, z }
};
const vec2 = (x, y) => {
    return { x, y }
};
const sub = (a, b) => Object.keys(a).map(u => a[u] - b[u]);
const add = (a, b) => Object.keys(a).map(u => a[u] + b[u]);
const dot = (a, b) => sum(Object.keys(a).map(u => a[u] * b[u]));
const norm = (a) => Math.sqrt(sum(Object.keys(a).map(u => a[u] * a[u])));
export { vec2, vec3, vec4, sub, add, dot, norm};