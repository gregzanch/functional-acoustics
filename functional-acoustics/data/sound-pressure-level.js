import Data from './data';
import units from '../units/units';
import WeightTranslation from '../verbose/translations/weight-translation';
import Weight from '../weight/weight';
import num from '../util/num';


class SoundPressureLevel extends Data {
    constructor(id) {
        super(id);
        this.setType('SoundPressureLevel');
        this.unit = 'dB';
        this.weight = undefined;
        this.ref = units.convert(20).from('uPa').to('Pa');
          
    }
    setUnit(unit) {
        let error = false;
        try {
            units.checkConversion(unit, this.unit);
        } catch (err) {
            error = true;
            console.error(err);
        } finally {
            if (!error) {
                this.unit = unit;
                this.ref = units.convert(20).from('uPa').to(this.unit);
                return this;
            } else {
                return this;
            }
        }
    }
    setWeight(weight) {
        const w = WeightTranslation(weight);
        if (w !== null) {
            this.weight = w;
            this.unit = `dB-${this.weight.toUpperCase()} (re: 20uPa)`;
        }
        return this;
    }
    changeWeight(desiredWeight,frequencies) {
        if (!this.weight) {
            const err = 'You must call .setWeight() before calling .to()';
            console.error(err);
            return null;
        } else {
            const dw = WeightTranslation(desiredWeight);
            if (dw !== null) {
                let _data = this.data;
                if (num.numCheck(this.data)) {
                    _data = [_data];
                }
                let dbz = [];
                switch (this.weight) {
                    case 'a':
                        const a = frequencies.map(f => Weight.A(f));
                        dbz = _data.map((x, i) => x - a[i]);
                        break;
                    case 'b':
                        const b = frequencies.map(f => Weight.B(f));
                        dbz = _data.map((x, i) => x - b[i]);
                        break;
                    case 'c':
                        const c = frequencies.map(f => Weight.C(f));
                        dbz = _data.map((x, i) => x - c[i]);
                        break;
                    case 'd':
                        const d = frequencies.map(f => Weight.D(f));
                        dbz = _data.map((x, i) => x - d[i]);
                        break;
                    case 'z':
                        dbz = _data;
                        break;
                    default:
                        break;
                }    
                switch (dw) {
                    case 'a':
                        const a = frequencies.map(f => Weight.A(f));
                        this.data = dbz.map((x, i) => x + a[i]);
                        this.weight = dw;
                         this.unit = `dB-${this.weight.toUpperCase()} (re: 20uPa)`;
                        break;

                    case 'b':
                        const b = frequencies.map(f => Weight.B(f));
                        this.data = dbz.map((x, i) => x + b[i]);
                        this.weight = dw;
                         this.unit = `dB-${this.weight.toUpperCase()} (re: 20uPa)`;
                        break;
                    case 'c':
                        const c = frequencies.map(f => Weight.C(f));
                        this.data = dbz.map((x, i) => x + c[i]);
                        this.weight = dw;
                         this.unit = `dB-${this.weight.toUpperCase()} (re: 20uPa)`;
                        break;
                    case 'd':
                        const d = frequencies.map(f => Weight.D(f));
                        this.data = dbz.map((x, i) => x + d[i]);
                        this.weight = dw;
                         this.unit = `dB-${this.weight.toUpperCase()} (re: 20uPa)`;
                        break;
                    case 'z':
                        this.data = dbz;
                        this.weight = dw;
                         this.unit = `dB-${this.weight.toUpperCase()} (re: 20uPa)`;
                        break;
                    default:
                        break;
                }
                return this;
            } else {
                return null;
            }
        }
    }
    convertTo(unit) {
        if (units.checkConversion(unit, this.unit)) {
            switch (this._data_is) {
                case "number":
                    this.data = units.convert(this.data).from(this.unit).to(unit);
                    this.unit = unit;
                    this.ref = units.convert(20).from('uPa').to(this.unit);
                    break;
                case "array":
                    this.data = this.data.map(x => units.convert(x).from(this.unit).to(unit));
                    this.unit = unit;
                    this.ref = units.convert(20).from('uPa').to(this.unit);
                default:
                    break;
            }
        }
        return this;
    }
    
}

export default SoundPressureLevel;