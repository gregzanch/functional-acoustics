class Complex {
    constructor() {
        if (arguments.length == 1) {
            this.real = arguments[0];
             if (Number.isFinite(this.real)) {
                 this.imag = 0;
             } else if (this.real instanceof Array) {
                 this.imag = new Array(this.real.length).fill(0);
             } else {
                 console.log(this.real);
                 throw "unsupported data type";
             }
        }
        else if (arguments.length == 2) {
            this.real = arguments[0];
            this.imag = arguments[1];
        }
        else if (arguments.length == 0 || arguments.length > 2) {
            throw "too many arguments";
        }
    }
    isComplex(n) {
        return n?(n instanceof Complex):true;
    }
}
export default Complex;