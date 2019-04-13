function R_a(f) {
  let f2 = f * f;
  let f4 = f2 * f2;
  return (
    (148693636 * f4) /
    ((f2 + 424.36) *
      Math.sqrt((f2 + 11599.29) * (f2 + 544496.41)) *
      (f2 + 148693636))
  );
}
/** Calculates the A-weight values for the specified frequency/frequencies
 * @function A
 * @param {number|number[]} f frequency/frequencies
 */
function A(f) {
    if (typeof f === "number") {
        return 20 * Math.log10(R_a(f)) + 2.0;
    }
    else if (f instanceof Array) {
        return f.map(function (freq) {
            return 20 * Math.log10(R_a(freq)) + 2.0;
        })
    }
}

export default A;