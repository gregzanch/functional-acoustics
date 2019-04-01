import convert from './convert.js';

const units = {
    convert: convert,
    checkConversion: (fromUnit, toUnit) => convert().from(fromUnit).possibilities().filter(x => x === toUnit).length > 0
};

export default units;