
const Energy = {

    /** Energy Density Calculation
     * Architectural Acoustics pg. 64 'Energy Density' Marshal Long, Second Edition
     * 
     * @param  {Number} E Energy Contained in a Sound Wave
     * @param  {Number} S Measurement Area
     * @param  {Number} c Speed of Sound
     * @param  {Number} t Time
     * @param  {Number} W Power
     * @param  {Number} I Intensity
     * @param  {Number} p Pressure
     * @param  {Number} rho Bulk Density of Medium
     */
    Density: ({ E, S, c, t, W, I, p, rho, help } = {}) => {
        if (E && S && c && t) {
            console.log(1);
            return E / (S * c * t);
        }
        else if (W && S && c) {
            console.log(2);
            return W / (S * c);
        }
        else if (I && c) {
            console.log(3);
            return (I / c);
        }
        else if (p && rho && c) {
            console.log(4);
            return (p * p) / (rho * c * c);
        }
        else if (help) {
            console.log(
                `/** Energy Density Calculation
                 * Architectural Acoustics pg. 64 'Energy Density' Marshal Long, Second Edition
                 * 
                 * @param  {Number} E Energy Contained in a Sound Wave
                 * @param  {Number} S Measurement Area
                 * @param  {Number} c Speed of Sound
                 * @param  {Number} t Time
                 * @param  {Number} W Power
                 * @param  {Number} I Intensity
                 * @param  {Number} p Pressure
                 * @param  {Number} rho Bulk Density of Medium
                 */`
            );
        }
        else throw 'Not enough input parameters given';
    }
}

export default Energy;