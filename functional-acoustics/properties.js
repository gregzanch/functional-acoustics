
import each from './lib/lodash/each';
import bands from './bands/bands';
const Properties = {
  /**
   * Calculate the speed of sound in a given material
   * using Young's Modulus 'E' and density 'rho'
   * @param E Young's Modulus
   * @param rho Density
   * @returns Speed of Sound
   */
  SpeedOfSound: (E, rho) => {
    return Math.sqrt(E / rho);
  },

  /**
   * Calculate wave number 'k'
   * @param omega Angular Frequency
   * @param c Speed of Sound
   * @returns Wave Number 'k'
   */
  WaveNumber: (omega, c) => {
    return omega / c;
  },

  /**
   * Calculate acoustic impedance 'Z'
   * @param rho Density
   * @param c Speed of Sound
   * @returns Acoustic Impedance 'Z'
   */
  Impedance: (rho, c) => {
    return rho * c;
  },

  Air: {
    SpeedOfSound: props => {
      let temp = props.temp.value || 273.15;
      let tempunits = props.temp.units || "K";
      let returnunits = props.units || "m/s";
      let c = 20.04 * Math.sqrt(temp);
      switch (tempunits) {
        case "K":
          c = 20.04 * Math.sqrt(temp);
          break;
        case "C":
          c = 20.04 * Math.sqrt(273.15 + temp);
          break;
        case "F":
          c = 20.04 * Math.sqrt((temp - 32) * (5 / 9) + 273.15);
          break;
        default:
          break;
      }
      switch (returnunits) {
        case "ft/s":
          c *= 3.281;
          break;
        default:
          break;
      }
      return c;
    },
    /**
     * Calculate sound absorption in air
     * @param {Object} params Calculation parameters
     * @param {Number|Number[]} [params.frequency] Frequencies to calculate for (Defaults to Octave Band frequencies)
     * @param {Number} [params.temperature] Ambient Temperature (Defaults to 20 C)
     * @param {Number} [params.pressure] Atmospheric Pressure (Defaults to 101.325 kPa)
     * @param {Number} [params.humidity]  Humidity expressed as a percentage (Defaults to 50%)
     * @param {String} [params.tempUnits] Units for the temperature parameter (Defaults to C)
     * @param {String} [params.pressureUnits] Units for the pressure parameter (Defaults to kPa)
     * @param {String} [params.humidityMethod] How humidity parameter is expressed ('RH' for Relative Humidity, 'Mol' for Molar Concentration of Water Vapour) (Defaults to 'RH')
     * @see http://resource.npl.co.uk/acoustics/techguides/absorption/
     */
    Absorption: params => {
      let Freq = params.frequency || bands.Octave.Nominal;
      let T = params.temperature || 20;
      let P = params.pressure || 101.325;
      let RH = true;
      let Humidity = params.Humidity || 50;
      let FreqIsNumber = (typeof Freq === "number");
      if (FreqIsNumber) Freq = [Freq];

        
      let alpha = Freq.map((F) => {
        const F2 = F * F;

        var Rh; // relative humidity
        var Alpha; // atmospheric absorption

        var T_ref; // temperature at 20C (Kelvin)
        var P_ref; // reference pressure (Pascals)
        var P_rel; // relative pressure
        var T_rel; // relative temperature
        var T_kel; // ambient temperature (Kelvin)
        var T_01; // triple point isotherm temperature (Kelvin)
        var P_sat_over_P_ref; // saturation vapour pressure/ reference pressure

        var Fro; // oxygen relaxation frequency (Hertz)
        var Frn; // nitrogen relaxation frequency (Hertz)
        var Xc, Xn, Xo; // intermediate calculations for classical, nitro and oxygen
        var H; // molecular concentration of water vapour
        var Kelvin = 273.15; //For converting to Kelvin
        var e = 2.718282;

        T_ref = Kelvin + 20; //Reference temp = 20 degC
        T_kel = Kelvin + T; //Measured ambient temp
        T_rel = T_kel / T_ref; //Relative temp
        T_01 = Kelvin + 0.01; //Triple point isotherm temperature (Kelvin)
        P_ref = 101.325; //Reference atmospheric P = 101.325 kPa
        P_rel = P / P_ref; //Relative pressure

        /* Molecular Concentration of water vapour */
        P_sat_over_P_ref = Math.pow(
          10,
          -6.8346 * Math.pow(T_01 / T_kel, 1.261) + 4.6151
        );

        /* ISO 9613-1, Annex B, B.1 */
        H = RH ? Humidity * (P_sat_over_P_ref / P_rel) : Humidity;

        /* ISO 9613-1, 6.2, eq.3 */
        Fro = P_rel * (24 + (40400 * H * (0.02 + H)) / (0.391 + H));

        /* ISO 9613-1, 6.2, eq.4 */
        Frn =
          (P_rel / Math.sqrt(T_rel)) *
          (9 + 280 * H * Math.pow(e, -4.17 * (Math.pow(T_rel, -1 / 3) - 1)));

        /* ISO 9613-1, 6.2, part of eq.5 */
        Xc = (0.0000000000184 / P_rel) * Math.sqrt(T_rel);
        Xo =
          0.01275 * Math.pow(e, -2239.1 / T_kel) * Math.pow(Fro + F2 / Fro, -1);
        Xn = 0.1068 * Math.pow(e, -3352 / T_kel) * Math.pow(Frn + F2 / Frn, -1);

        /* ISO 9613-1, 6.2, eq.5 */
        Alpha =
          20 * Math.log10(e) * F2 * (Xc + Math.pow(T_rel, -5 / 2) * (Xo + Xn));

        return Alpha;
      });
      return (FreqIsNumber)?alpha[0]:alpha;
    }
  }
};


export default Properties;