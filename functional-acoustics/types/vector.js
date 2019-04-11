

export function mul(k, v) {
    return new Vector(k * v.x, k * v.y, k * v.z);
};
export function sub(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
};
export function add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
};
export function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};
export function mag(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
};
export function norm(v) {
    var _mag = mag(v);
    var div = (_mag === 0) ? Infinity : 1.0 / _mag;
    return mul(div, v);
};
export function cross(v1, v2) {
    return new Vector(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
};
export class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    mul(k, v) {
        return new Vector(k * v.x, k * v.y, k * v.z);
    }
    sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    mag(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }
    norm(v) {
        var _mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        var div = (_mag === 0) ? Infinity : 1.0 / _mag;
        return mul(div, v);
    }
    cross(v1, v2) {
        return new Vector(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
    }
}