const Conversion = {
    LpFromLw: (Lw, r = 1, Q = 1) => {
        if (typeof Lw === "number") Lw = [Lw];
        return Lw.map(
            lw => lw - Math.abs(10 * Math.log10(Q / (4 * Math.PI * r * r)))
        );
    },
    LnFromLp: (Lp, Ar, Ao = 108) => {
        if (typeof Lp === "number") Lp = [Lp];
        return Lp.map(lp => lp - 10 * Math.log10(Ao / Ar));
    },
    temp: {
        c2f: c => (c * 9) / 5 + 32, // celcius to fahrenheit
        c2k: c => c + 273.15, // celcius to kelvin
        f2c: f => ((f - 32) * 5) / 9, // fahrenheit to celcius
        f2k: f => (f - 32) * (5 / 9) + 273.15, // fahrenheit to kelvin
        k2c: k => 273.15 - k, // kelvin to celcius
        k2f: k => (k - 273.15) * (9 / 5) + 32 // kelvin to fahrenheit
    }
};


export default Conversion;