import Weight from "./weight";
import Conversion from "./conversion";
import Bands from "./bands/bands";
import dBsum from "./functions/dBsum";
import Properties from "./properties";


class Measurement {
  constructor(data = [], type = "lp") {
    this.props = {
      type,
      data
    };
    this.weight = Weight;
    this.conversion = Conversion;
    this.bands = Bands;
    this.dBsum = dBsum;
    this.properties = Properties;
  }
  set(label, data) {
    this.props[label] = data;
    return this;
  }
}

export default Measurement;
