import { convolveComplex } from './fft';


/* 
 * Computes the circular convolution of the given real vectors. Each vector's length must be the same.
 */
export const Convolve = (x, y, out) => {
    var n = x.length;
    if (n != y.length || n != out.length)
        throw "Mismatched lengths";
    convolveComplex(x, Array(n).fill(0), y, Array(n).fill(0), out, Array(n).fill(0));
}
