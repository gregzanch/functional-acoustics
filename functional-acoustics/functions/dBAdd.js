/** 
 * Performs dB addition on every array passed in, rounded to an optional precision. 
 * @deprecated use dBsum instead
 * @param  {number[]} dBs - An n-dimmensional array of numbers
 * @param {number=} decimalPrecision - Number of decimals places to round the output to
 * @returns {number|number[]} A number or an (n-1)-dimmensional array of numbers
 */
const dBAdd = (dBs, decimalPrecision=1) => {
    let _sum_;
    if (typeof dBs === "number") {
        throw "dBAdd requires an array, not a single number";
    }
    else if (typeof dBs === "string") {
         throw "dBAdd requires an array, not a single string";
    }
    else if (typeof dBs === "object") {
            if (typeof dBs[0] === "number") {
                _sum_ = 10 * Math.log10(dBs.map(x => Math.pow(10, x / 10)).reduce((acc, a) => acc + a));
            }
            else if (typeof dBs[0] === "string") {
                try {
                    _sum_ = 10 * Math.log10(dBs.map(x => Math.pow(10, Number(x) / 10)).reduce((acc, a) => acc + a));
                } catch (error) {
                    throw error
                }
            }
            else if (typeof dBs[0] === "object") {
                try {
                    _sum_ = dBs.map(x => dBAdd(x));
                }
                catch (error) {
                    throw error
                }
            }
        return _sum_;
    }
    else {
        return null;
    }
}

export default dBAdd;

