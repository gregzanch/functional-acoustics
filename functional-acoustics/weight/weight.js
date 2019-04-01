/* https://en.wikipedia.org/wiki/A-weighting#Function_realisation_of_some_common_weightings */

import WeightTranslation from '../verbose/translations/weight-translation';

const Weight = {
    R_a: (f) => {
        let f2 = f * f;
        let f4 = f2 * f2;
        return (148693636 * f4) / ((f2 + 424.36) * Math.sqrt((f2 + 11599.29) * (f2 + 544496.41)) * (f2 + 148693636))
    },
    A: (f) => {
        if(typeof f == "number")
            return 20 * Math.log10(Weight.R_a(f)) + 2.00;
        else if (typeof f == "object")
            return f.map(freq=>20 * Math.log10(Weight.R_a(freq)) + 2.00);
    },
    R_b: (f) => {
        let f3 = f * f * f;
        let f2 = f * f;
        return (148693636 * f3) / ((f2 + 424.36) * Math.sqrt(f2 + 158 * 158) * (f2 * 148693636));
    },
    B: (f) => {
        if (typeof f == "number")
            return 20 * Math.log10(Weight.R_b(f)) + 0.17;
        else if (typeof f == "object")
            return f.map(freq => 20 * Math.log10(Weight.R_b(freq)) + 0.17);
    },
    R_c: (f) => {
        let f2 = f * f;
        return (148693636 * f2) / ((f2 + 424.36) * (f2 * 148693636));
    },
    C: (f) => {
        if (typeof f == "number")
            return 20 * Math.log10(Weight.R_c(f)) + 0.06;
        else if (typeof f == "object")
            return f.map(freq => 20 * Math.log10(Weight.R_c(freq)) + 0.06);
    },
    
    h: (f) => (Math.pow((1037918.48 - f * f), 2) + 1080768.16 * f * f) / (Math.pow((9837328 - f * f), 2) + 11723776 * f * f),
    R_d: (f) => ((f) / (6.8966888496476e-5)) * Math.sqrt(Weight.h(f) / ((f * f + 79919.29) * (f * f + 1345600))),
    D: (f) => 20*Math.log10(Weight.R_d(f)),
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