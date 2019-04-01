


const numCheck = (num) => Number.isFinite(Number(num));
const arrCheck = (arr) => Array.isArray(arr);
const numArrayCheck = (numArray) => arrCheck(numArray) ? numArray.filter(n => !numCheck(n)).length == 0 : false;
const computable = (v) => numCheck(v) || numArrayCheck(v);
export default { numCheck, arrCheck, numArrayCheck, computable }