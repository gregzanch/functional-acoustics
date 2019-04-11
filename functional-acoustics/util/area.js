
import { Vector } from '../types/vector';
const triangleArea = (r1, r2, r3) => {
    let a = Vector.prototype.mag(Vector.prototype.sub(r1, r2));
    let b = Vector.prototype.mag(Vector.prototype.sub(r2, r3));
    let c = Vector.prototype.mag(Vector.prototype.sub(r3, r1));
    let p = a + b + c;
    let s = p / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}

export default triangleArea;

