import octave_bands from './OctaveBands';
import third_octave_bands from './ThirdOctaveBands';


/**
 * @namespace Bands - Frequnecy band utilities
 */
const Bands = {
  /**
   * @namespace Octave - Octave Band utilities
   */
  Octave: {
    /**
     * @member Nominal - Octave band nominal center frequencies
     */
    Nominal: octave_bands.map(x => x.Center),
    /**
     * @member Nominal - Octave band frequencies with limits
     */
    withLimits: octave_bands,
    /**
     * @function fromRange - returns the octave bands center frequencies between the specified limits
     * @param {Number} start the lower frequency limit
     * @param {Number} end the upper frequency limit
     */
    fromRange: (start, end) =>
      octave_bands
        .map(x => x.Center)
        .filter(x => x >= Number(start) && x <= Number(end))
  },
  /**
   * @namespace ThirdOctave - Third octave Band utilities
   */
  ThirdOctave: {
    /**
     * @member Nominal - Third octave band nominal center frequencies
     */
    Nominal: third_octave_bands.map(x => x.Center),
    /**
     * @member Nominal - Third octave band frequencies with limits
     */
    withLimits: third_octave_bands,
    /**
     * @function fromRange - returns the third octave bands center frequencies between the specified limits
     * @param {Number} start the lower frequency limit
     * @param {Number} end the upper frequency limit
     * @returns {Number[]} third octave bands center frequencies between the specified limits
     */
    fromRange: (start, end) => {
      return third_octave_bands
        .map(x => x.Center)
        .filter(x => x >= Number(start) && x <= Number(end));
    }
  },
  /**
   * @function Flower returns the band's lower frequency limit
   * @param {Number} k - band fraction (i.e. 3 for 3rd octave, 1 for whole octave)
   * @param {Number} fc - band cetner frequency
   * @returns {Number} the band's lower frequency limit
   */
  Flower: (k, fc) => {
    if (typeof fc === "number") fc = [fc];
    return fc.map(f => f / Math.pow(2, 1 / (2 * k)));
  },
  /**
   * @function Fupper returns the band's upper frequency limit
   * @param {Number} k - band fraction (i.e. 3 for 3rd octave, 1 for whole octave)
   * @param {Number} fc - band cetner frequency
   * @returns {Number} the band's upper frequency limit
   */
  Fupper: (k, fc) => {
    if (typeof fc === "number") fc = [fc];
    return fc.map(f => f * Math.pow(2, 1 / (2 * k)));
  }
};


export default Bands;