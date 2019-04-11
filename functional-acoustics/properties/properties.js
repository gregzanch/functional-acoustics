const Properties = {

    //todo provide material properties from page 59 of fundamentals of acoustics, table 2.3.


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
     * @param lambda wavelength
     * @returns Wave Number 'k'
     */
    WaveNumber: ({ omega, c, lambda }) => {
        if (lambda) {
            return 2 * Math.PI / lambda;
        }
        else if (omega && c) {
            return omega / c;
        }
        else {
            throw 'Not enough parameters!'
        }
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
        SpeedOfSound: (props) => {
            let temp = props.temp.value || 273.15;
            let tempunits = props.temp.units || "K";
            let returnunits = props.units || "m/s";
            let c = 20.04 * Math.sqrt(temp);
            switch (tempunits) {
                case "K":
                    c = 20.04 * Math.sqrt(temp)
                    break;
                case "C":
                    c = 20.04 * Math.sqrt(273.15+temp)
                    break;
                case "F":
                    c = 20.04 * Math.sqrt((temp - 32) * (5 / 9) + 273.15)
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
        }
    }
}

export default Properties;