/** 
 * Returns the dB sum of every array passed in, rounded to an optional precision. 
 * @param  {Number[]} dBs - An n-dimmensional array of numbers
 * @param {Number} decimalPrecision - Number of decimals places to round the output to
 * @returns {Number|Number[]} A number or an (n-1)-dimmensional array of numbers
 */
const dBsum = (dBs, decimalPrecision = 1) => {
    let _sum_;
    let precision = '1'
    for (let i = 0; i < decimalPrecision; i++){
        precision+="0"
    };
    precision = Number(precision);
    if (typeof dBs === "number") {
        throw "dBsum requires an array, not a single number";
    } else if (typeof dBs === "string") {
        throw "dBsum requires an array, not a single string";
    } else if (typeof dBs === "object") {
        if (typeof dBs[0] === "number") {
            _sum_ = Math.round(10 * Math.log10(dBs.map(x => Math.pow(10, x / 10)).reduce((acc, a) => acc + a))*precision)/precision;
        } else if (typeof dBs[0] === "string") {
            try {
                _sum_ = Math.round(10 * Math.log10(dBs.map(x => Math.pow(10, Number(x) / 10)).reduce((acc, a) => acc + a)) * precision) / precision;
            } catch (error) {
                throw error
            }
        } else if (typeof dBs[0] === "object") {
            try {
                _sum_ = dBs.map(x => dBsum(x,decimalPrecision));
            } catch (error) {
                throw error
            }
        }
        return _sum_;
    } else {
        return null;
    }
}

export default dBsum;
