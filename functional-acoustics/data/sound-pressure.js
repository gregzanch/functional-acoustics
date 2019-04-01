import Data from './data';
import units from '../units/units';


class SoundPressure extends Data{
    constructor(id) {
        super(id);
        this.setType('SoundPressure');
        this.unit = 'Pa';
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

export default SoundPressure;