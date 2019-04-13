/* https://en.wikipedia.org/wiki/A-weighting#Function_realisation_of_some_common_weightings */

import WeightTranslation from '../verbose/translations/weight-translation';
import A from './A';
import B from './B'
const pow2 = (x) => Math.pow(x, 2);
const pow3 = (x) => Math.pow(x, 3);
const sqrt = Math.sqrt;

const Weight = {
    A,
    B,
    R_c: (f) => (pow2(12194) * pow2(f)) / ((pow2(f) + pow2(20.6)) * (pow2(f) + pow2(12194))),
    C: (f) => {
        if (typeof f == "number")
            return 20 * Math.log10(Weight.R_c(f)) + 0.06;
        else if (typeof f == "object")
            return f.map(freq => 20 * Math.log10(Weight.R_c(freq)) + 0.06);
    },

    h: (f) => (Math.pow((1037918.48 - f * f), 2) + 1080768.16 * f * f) / (Math.pow((9837328 - f * f), 2) + 11723776 * f * f),
    R_d: (f) => ((f) / (6.8966888496476e-5)) * Math.sqrt(Weight.h(f) / ((f * f + 79919.29) * (f * f + 1345600))),
    D: (f) => 20 * Math.log10(Weight.R_d(f)),
    
    convert: (freq_db_pairs) => {
        return new _WeightConverter(freq_db_pairs);
    }
};

class _WeightConverter {
    constructor(freq_db_pairs) {
        this.frequencies = freq_db_pairs.map(fdb => fdb[0]);
        this.dbs = freq_db_pairs.map(fdb => fdb[1]);
    }
    from(originalWeight) {
        const ow = WeightTranslation(originalWeight);
        if (ow !== null) {
            switch (ow) {
                case 'a':
                    const a = this.frequencies.map(f => Weight.A(f));
                    this.dbz = this.dbs.map((x, i) => x - a[i]);
                    break;
                case 'b':
                    const b = this.frequencies.map(f => Weight.B(f));
                    this.dbz = this.dbs.map((x, i) => x - b[i]);
                    break;
                case 'c':
                    const c = this.frequencies.map(f => Weight.C(f));
                    this.dbz = this.dbs.map((x, i) => x - c[i]);
                    break;
                case 'd':
                    const d = this.frequencies.map(f => Weight.D(f));
                    this.dbz = this.dbs.map((x, i) => x - d[i]);
                    break;
                case 'z':
                    this.dbz = this.dbs;
                    break;
                default:
                    break;
            }
            return this;
        } else {
            return null;
        }
    }
    to(desiredWeight) {
        if (!this.dbz) {
            const err = 'You much call .from() before calling .to()';
            console.error(err);
            return null;
        } else {
            const dw = WeightTranslation(desiredWeight);
            if (dw !== null) {
                switch (dw) {
                    case 'a':
                        const a = this.frequencies.map(f => Weight.A(f));
                        return this.dbz.map((x, i) => x + a[i]);
                    case 'b':
                        const b = this.frequencies.map(f => Weight.B(f));
                        return this.dbz.map((x, i) => x - b[i]);
                    case 'c':
                        const c = this.frequencies.map(f => Weight.C(f));
                        return this.dbz.map((x, i) => x - c[i]);
                    case 'd':
                        const d = this.frequencies.map(f => Weight.D(f));
                        return this.dbz.map((x, i) => x - d[i]);
                    case 'z':
                        return this.dbz;
                    default:
                        return null;
                }
            } else {
                return null;
            }
        }
    }
}

export default Weight;