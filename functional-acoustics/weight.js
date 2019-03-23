/* https://en.wikipedia.org/wiki/A-weighting#Function_realisation_of_some_common_weightings */


const Weight = {
    R_a: (f) => {
        let f2 = f * f;
        let f4 = f2 * f2;
        return (148693636 * f4) / ((f2 + 424.36) * Math.sqrt((f2 + 11599.29) * (f2 + 544496.41)) * (f2 + 148693636))
    },
    A: (f) => {
        if(typeof f == "number")
            return 20 * Math.log10(Weight.R_a(f)) + 2.00;
        else if (typeof f == "object")
            return f.map(freq=>20 * Math.log10(Weight.R_a(freq)) + 2.00);
    },
    R_b: (f) => {
        let f3 = f * f * f;
        let f2 = f * f;
        return (148693636 * f3) / ((f2 + 424.36) * Math.sqrt(f2 + 158 * 158) * (f2 * 148693636));
    },
    B: (f) => {
        if (typeof f == "number")
            return 20 * Math.log10(Weight.R_b(f)) + 0.17;
        else if (typeof f == "object")
            return f.map(freq => 20 * Math.log10(Weight.R_b(freq)) + 0.17);
    },
    R_c: (f) => {
        let f2 = f * f;
        return (148693636 * f2) / ((f2 + 424.36) * (f2 * 148693636));
    },
    C: (f) => {
        if (typeof f == "number")
            return 20 * Math.log10(Weight.R_c(f)) + 0.06;
        else if (typeof f == "object")
            return f.map(freq => 20 * Math.log10(Weight.R_c(freq)) + 0.06);
    }
};
export default Weight;