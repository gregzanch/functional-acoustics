import mean from './mean';

const std = (x, normalization) => {
    let norm = normalization || 'unbiased'
    let m = mean(x);
    let n = [];
    n['unbiased'] = -1;
    n['uncorrected'] = 0;
    n['biased'] = 1;

    let s = Math.sqrt(x.map(u => Math.pow(u - m, 2)).reduce((p, c) => p + c) / (x.length + n[norm]));
    return s;
}

export default std;