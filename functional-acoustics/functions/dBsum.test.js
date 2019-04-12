/**
 * Operations to calculate the depths of a nested array
 * @author Kyle Phillips
 * @module 'array-depth'
 */


const maxDepth = (a) => {
    let maxVal = Number.MIN_VALUE
    let item

    a.forEach(val => {
        let depth = max(val)
        if (depth > maxVal) {
            maxVal = depth
            item = val
        }
    })

    return item
}

const minDepth = (a) => {
    let minVal = Number.MAX_VALUE
    let item

    a.forEach(val => {
        let depth = min(val)
        if (depth < minVal) {
            minVal = depth
            item = val
        }
    })

    return item
}

/**
 * find the maximum depth of nested arrays
 * @param {Array} a
 * @param {Number}[count]
 */
const max = (a, count = 0) =>
    Array.isArray(a) ? max(maxDepth(a), count + 1) : count

/**
 * find the minimum depth of nested arrays
 * @param {Array} a
 * @param {Number} [count]
 */
const min = (a, count = 0) =>
    Array.isArray(a) ? min(minDepth(a), count + 1) : count



function dBSum(values) {
    if (values instanceof Array) {
        return 10 * Math.log10(values.map(x => Math.pow(10, Number(x) / 10)).reduce((acc, a) => acc + a));
    } else {
        return null;
    }
}

const data = [
    
];


console.log(dBSum(data));