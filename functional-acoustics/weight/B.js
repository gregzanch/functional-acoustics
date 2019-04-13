const pow2 = function pow2(x) {
    return Math.pow(x, 2);
}
const pow3 = function pow3(x) {
    return Math.pow(x, 3);
}
function R_b(f) {
  return pow2(12194) * pow3(f) / ((pow2(f) + pow2(20.6)) * Math.sqrt(pow2(f) + pow2(158)) * (pow2(f) + pow2(12194)))
}
/** Calculates the B-weight values for the specified frequency/frequencies
 * @function B
 * @param {number|number[]} f frequency/frequencies
 */
function B(f) {
    if (typeof f == "number")
        return 20 * Math.log10(R_b(f)) + 0.17;
    else if (typeof f == "object")
        return f.map(function (freq) {
            return 20 * Math.log10(R_b(freq)) + 0.17;
        })
}

export default B;