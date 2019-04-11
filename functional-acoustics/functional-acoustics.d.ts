// Type definitions for functional-acoustics 
// Project: functional-acoustics

export namespace AC {
  /**
   * Provides methods for frequency weighting sound level measurements
   */
  export const Weight: Object;

  /**
   * Provides methods for converting between different quantites,
   * like converting from sound pressure (lp) to sound power (lw)
   */
  export const Conversion: Object;

  /**
   * Provides methods for frequency band operations
   */
  export const Bands: Object;

  /**
   * Returns the dB sum of every array passed in, rounded to an optional precision.
   * @param  {Number[]} dBs - An n-dimmensional array of numbers
   * @param {Number} decimalPrecision - Number of decimals places to round the output to
   * @returns {Number|Number[]} A number or an (n-1)-dimmensional array of numbers
   */
  export function dBsum(
    dBs: Number[],
    decimalPrecision: Number
  ): Number | Number[];

  /**
   * Provides methods pertaining to the transmission of sound through a material.
   */
  const Transmission: Object;

  /**
   * Provides methods and values pertaining to the properties of different materials
   */
  const Properties: Object;

  /**
   * @function RoomModes
   * @description Calculates the modal frequencies of a room of specified dimmensions
   * @param {Object} params - Solver parameters
   * @param {Number} params.length - Room length (default units of feet)
   * @param {Number} params.width - Room width (default units of feet)
   * @param {Number} params.height - Room height (default units of feet)
   * @param {String} [params.units] - Can be either "english" for feet, or "si" for meters. Defaults to "english"
   * @param {Number} [params.c] - Speed of sound in "ft/s" for "english", or "m/s" for "si"
   * @param {Number[]} [params.frequencyRange] - Frequency limits as an array (i.e. [minFrequency, maxFrequency]). Defaults to [16, 500];
   * @param {String} [params.stdNormalization] - Normalization for standard deviation calculation. Can be 'unbiased' (default), 'uncorrected', or 'biased';
   * @param {String} [params.overlapPenalty] - Penalty for overlapping modes (used to calculate score). Can be '*' (default), '+', or 'none'.
   * @param {Number} [params.overlapWidth] - Used to calculate score (i.e. overlapping = nextFrequency < overlapWidth * currentFrequency). Defaults to 0.1;
   * @param {Number} [params.modeLimit] - Used to calculate the maximum mode number. Defaults to 15 (which should be plenty)
   * @param {Boolean} [params.sortFrequencies] - Whether or not the frequencies should be sorted. Defaults to true
   * @param {Boolean} [params.sortBonello] - Whether or not the bonello data should be sorted. Defaults to true
   * @returns {Object} Returns the modal frequencies as well as the bonello distribution for the given input parameters
   */
    export function RoomModes(params: Object): Object;
  
    /**
     * Common engineering constants
     */
    const Constants: Object;

    /**
     * Provides a way to chain operations on measurement sound level data
     */
    export class Measurement { };


    const Types: Object;
    function FFT(real: number[]): Function;
    const RT: Object;
    const Buffer: Object;
    const RMS: Object;
    const units: Object;
    const Complex: Object;
    const Signal: Object;
    const Energy: Object;
}

