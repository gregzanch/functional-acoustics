import AC from '../functional-acoustics.js';
window.AC = AC;

class idek{
    constructor(value) {
        this.value = value;
    }
    valueOf() {
        return this.value;
    }
}

window.obj1 = new idek(4);
window.obj2 = new idek(6);

console.log(obj1 + obj2);