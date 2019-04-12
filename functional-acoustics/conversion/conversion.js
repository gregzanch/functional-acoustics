const Conversion = {
    LpFromLw: (Lw, r = 1, Q = 1) => {
        if (typeof Lw === "number")
            Lw = [Lw]
        return Lw.map(lw => lw - Math.abs(10 * Math.log10(Q / (4 * Math.PI * r * r))));
    },
    LnFromLp: (Lp, Ar, Ao = 108) => {
        if (typeof Lp === "number")
            Lp = [Lp]
        return Lp.map(lp => lp - 10 * Math.log10(Ao / Ar));
    }
}



export default Conversion;