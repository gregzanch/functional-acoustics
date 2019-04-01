import Data from './data';
import units from '../units/units';
class SoundPowerLevel extends Data {
      constructor(id) {
          super(id);
          this.setType('SoundPowerLevel');
          this.unit = 'dB';
          this.ref = 1e-12;
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

                      break;
                  case "array":
                      this.data = this.data.map(x => units.convert(x).from(this.unit).to(unit));
                      this.unit = unit;

                  default:
                      break;
              }
          }
          return this;
      }
}

export default SoundPowerLevel;