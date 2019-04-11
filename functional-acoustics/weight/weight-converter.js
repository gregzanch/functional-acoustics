import Weight from './weight';
import WeightTranslation from '../verbose/translations/weight-translation';


/** Class for converting weighted measurements */
class WeightConverter {
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
            const err = 'You must call .from() before calling .to()';
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
                        return this.dbz.map((x, i) => x + b[i]);
                    case 'c':
                        const c = this.frequencies.map(f => Weight.C(f));
                        return this.dbz.map((x, i) => x + c[i]);
                    case 'd':
                        const d = this.frequencies.map(f => Weight.D(f));
                        return this.dbz.map((x, i) => x + d[i]);
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

export default WeightConverter;