import { vec3, add, sub, dot, norm } from '../geometry/vector';

const triangleArea = (r1, r2, r3) => {
    let a = norm(sub(r1, r2));
    let b = norm(sub(r2, r3));
    let c = norm(sub(r3, r1));
    let p = a + b + c;
    let s = p / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}

export default triangleArea;