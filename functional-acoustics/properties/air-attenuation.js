/** Calculates air attenuation
 * ANSI Standard S1-26:1995, or ISO 9613-1:1996. 
 * @see https://www.mne.psu.edu/lamancusa/me458/10_osp.pdf
 * 
 * @param  {Number|Number[]} frequency - frequency (or frequencies) to evaluate at
 * @param  {Number} [temperature] - Temperature (defaults to 70F)
 * @param  {String} [temperatureUnits] - units for the input temperature (defaults to F)
 * @param  {Number} [humidity] - relative humidity as a percentage (defaults to 50)
 * @param  {Number} [pressure] - atmospheric pressure in atm
 * @param  {String} [attenuationUnits] - either "ft" or "m" (defaults to ft);
 * @returns {Number|Number[]} air attenuation in dB/(ft or m);
 */
export function airAttenuation({
    frequency,
    temperature,
    temperatureUnits,
    humidity,
    pressure,
    attenuationUnits
}) {
    humidity = humidity || 40;
    attenuationUnits = attenuationUnits || "ft";
    temperature = temperature || 68;
    temperatureUnits = temperatureUnits || "F";
    temperature = AC.units.convert(temperature).from(temperatureUnits).to('K');

    const _airAttenuation = (f) => {
        let C_humid = 4.6151 - 6.8346 * Math.pow((273.15 / temperature), 1.261);
        let hum = humidity * Math.pow(10, C_humid);

        let f2 = f * f;
        let coef1 = 869 * f2;
        let trel = temperature / 293.15;
        let f_relax_oxygen = (24 + 4.04e4 * hum * (0.02 + hum) / (0.391 + hum));
        let f_relax_nitrogen = Math.pow(trel, -0.5) * (9 + 280 * hum * Math.exp(-4.17 * (Math.pow(trel, -1 / 3) - 1)));

        let denominator_oxygen = f_relax_oxygen + f2 / f_relax_oxygen;
        let denominator_nitrogen = f_relax_nitrogen + f2 / f_relax_nitrogen;

        let root_relativeTemp = Math.sqrt(trel);
        let eq_coef = Math.pow(trel, -2.5);
        let eq_oxygen = 0.01275 * Math.exp(-2239.1 / temperature) / denominator_oxygen;
        let eq_nitrogen = 0.10680 * Math.exp(-3352.0 / temperature) / denominator_nitrogen;

        let alpha = 0.001 * coef1 * (1.84e-11 * root_relativeTemp + eq_coef * (eq_oxygen + eq_nitrogen));

        if (attenuationUnits === "ft") {
            alpha = alpha / 3.28;
        }


        return alpha;
    }

    if (frequency instanceof Array) {
        return frequency.map(f => _airAttenuation(f));
    } else if (Number.isFinite(frequency)) {
        return _airAttenuation(frequency);
    }
}
