/** Declaration file generated by dts-gen */

export class Complex {
    constructor(...args: any[]);

    isComplex(...args: any[]): void;

}

export class Measurement {
    constructor(...args: any[]);

    addData(...args: any[]): void;

    changeWeight(...args: any[]): void;

    lastOperation(...args: any[]): void;

    ofType(...args: any[]): void;

    setFrequency(...args: any[]): void;

    setName(...args: any[]): void;

    setType(...args: any[]): void;

    withName(...args: any[]): void;

    withWeight(...args: any[]): void;

}

export class RT {
    constructor(...args: any[]);

    addSurface(...args: any[]): void;

    calculateRT(...args: any[]): void;

    getSurfaceByName(...args: any[]): void;

    resolveRelations(...args: any[]): void;

    resolveSurfaceArea(...args: any[]): void;

    resolveUnitConstant(...args: any[]): void;

    setAirAbsorption(...args: any[]): void;

    setFrequency(...args: any[]): void;

    setUnits(...args: any[]): void;

    setVolume(...args: any[]): void;

}

export class RTOptimizer {
    constructor(...args: any[]);

    calculateMSE(...args: any[]): void;

    calculateMSEQuiet(...args: any[]): void;

    calculateRT(...args: any[]): void;

    calculateRTPrime(...args: any[]): void;

    optimize(...args: any[]): void;

    optimizePrime(...args: any[]): void;

    setGoal(...args: any[]): void;

    setIterCount(...args: any[]): void;

    setIterRate(...args: any[]): void;

    setStepSize(...args: any[]): void;

}

export class Surface {
    constructor(...args: any[]);

    addChild(...args: any[]): void;

    resolveSabins(...args: any[]): void;

    setVar(...args: any[]): void;

}

export class Vector {
    constructor(...args: any[]);

    add(...args: any[]): void;

    cross(...args: any[]): void;

    dot(...args: any[]): void;

    mag(...args: any[]): void;

    mul(...args: any[]): void;

    norm(...args: any[]): void;

    sub(...args: any[]): void;

}

export const Iref: {
    units: string;
    value: number;
};

export const Wref: {
    units: string;
    value: number;
};

export const pref: {
    units: string;
    value: number;
};

export function Buffer(arr: any, n: any, fill: any): any;

export function CurrentDemand({ Je, Ve, f }: any): any;

export function FFT(real: any): any;

export function Hann(N: any): any;

export function I2dB({ I, units }: any): any;

export function IFFT(real: any): any;

export function ParseOBJ(obj: any): void;

export function ParseOBJ_dom({ element, loaded, error }: any): void;

export function PowerDemand({ channels, J, duty, efficieny, Jq }: any): any;

export function RMS(samples: any): void;

export function RoomModes(params: any): any;

export function SoundPowerScan({ frequency, surfaceData }: any): any;

export function W2dB({ W, units }: any): any;

export function airAttenuation({
        frequency,
        temperature,
        temperatureUnits,
        humidity,
        pressure,
        attenuationUnits
    }: any): any;

export function dB2I({ dB, units }: any): any;

export function dB2W({ dB, units }: any): any;

export function dB2p({ dB, units }: any): any;

export function dBsum(dBs: any, decimalPrecision: any): any;

export function p2dB({ p, units }: any): any;

export function readTextFile({ element, loaded, error }: any): void;

export function round(value: any, precision: any): void;

export namespace Bands {
    function Flower(k: any, fc: any): any;

    function Fupper(k: any, fc: any): any;

    namespace Octave {
        const Nominal: number[];

        const withLimits: {
            Center: number;
            Lower: number;
            Upper: number;
        }[];

        function fromRange(start: any, end: any): void;

    }

    namespace ThirdOctave {
        const Nominal: number[];

        const withLimits: {
            Center: number;
            Lower: number;
            Upper: number;
        }[];

        function fromRange(start: any, end: any): any;

    }

}

export namespace Complex {
    namespace prototype {
        function isComplex(...args: any[]): void;

    }

}

export namespace Conversion {
    function LnFromLp(Lp: any, Ar: any, Ao: any): any;

    function LpFromLw(Lw: any, r: any, Q: any): any;

}

export namespace CurrentDemand {
    const prototype: {
    };

}

export namespace Energy {
    function Density({ E, S, c, t, W, I, p, rho, help }: any): any;

}

export namespace Hann {
    const prototype: {
    };

}

export namespace I2dB {
    const prototype: {
    };

}

export namespace Measurement {
    namespace prototype {
        function addData(...args: any[]): void;

        function changeWeight(...args: any[]): void;

        function lastOperation(...args: any[]): void;

        function ofType(...args: any[]): void;

        function setFrequency(...args: any[]): void;

        function setName(...args: any[]): void;

        function setType(...args: any[]): void;

        function withName(...args: any[]): void;

        function withWeight(...args: any[]): void;

    }

}

export namespace PowerDemand {
    const prototype: {
    };

}

export namespace Properties {
    function Impedance(rho: any, c: any): any;

    function SpeedOfSound(E: any, rho: any): any;

    function WaveNumber({ omega, c, lambda }: any): any;

    namespace Air {
        function SpeedOfSound(props: any): any;

    }

}

export namespace RT {
    namespace prototype {
        function addSurface(...args: any[]): void;

        function calculateRT(...args: any[]): void;

        function getSurfaceByName(...args: any[]): void;

        function resolveRelations(...args: any[]): void;

        function resolveSurfaceArea(...args: any[]): void;

        function resolveUnitConstant(...args: any[]): void;

        function setAirAbsorption(...args: any[]): void;

        function setFrequency(...args: any[]): void;

        function setUnits(...args: any[]): void;

        function setVolume(...args: any[]): void;

    }

}

export namespace RTOptimizer {
    namespace prototype {
        function addSurface(...args: any[]): void;

        function calculateMSE(...args: any[]): void;

        function calculateMSEQuiet(...args: any[]): void;

        function calculateRT(...args: any[]): void;

        function calculateRTPrime(...args: any[]): void;

        function getSurfaceByName(...args: any[]): void;

        function optimize(...args: any[]): void;

        function optimizePrime(...args: any[]): void;

        function resolveRelations(...args: any[]): void;

        function resolveSurfaceArea(...args: any[]): void;

        function resolveUnitConstant(...args: any[]): void;

        function setAirAbsorption(...args: any[]): void;

        function setFrequency(...args: any[]): void;

        function setGoal(...args: any[]): void;

        function setIterCount(...args: any[]): void;

        function setIterRate(...args: any[]): void;

        function setStepSize(...args: any[]): void;

        function setUnits(...args: any[]): void;

        function setVolume(...args: any[]): void;

    }

}

export namespace Signal {
    function PureTone(params: any): any;

}

export namespace SoundPowerScan {
    const prototype: {
    };

}

export namespace Surface {
    namespace prototype {
        function addChild(...args: any[]): void;

        function resolveSabins(...args: any[]): void;

        function setVar(...args: any[]): void;

    }

}

export namespace Transmission {
    function NR({ TL,  absorption,area, Lsource, Lreciever }: any): any;

    function TL({ tau, NR, area, absorption, Z, m, f }: any): any;

    function coefficient({ TL, Z, m, f, rho, L, c }: any): any;

    function compositeTL(wallElements: any): any;

}

export namespace Types {
    class SoundIntensityLevel {
        constructor(...args: any[]);

        convertTo(...args: any[]): void;

        setUnit(...args: any[]): void;

    }

    class SoundPowerLevel {
        constructor(...args: any[]);

        convertTo(...args: any[]): void;

        setUnit(...args: any[]): void;

    }

    class SoundPressure {
        constructor(...args: any[]);

        convertTo(...args: any[]): void;

        setUnit(...args: any[]): void;

    }

    class SoundPressureLevel {
        constructor(...args: any[]);

        changeWeight(...args: any[]): void;

        convertTo(...args: any[]): void;

        setUnit(...args: any[]): void;

        setWeight(...args: any[]): void;

    }

    function SoundIntensity(...args: any[]): void;

    function SoundPower(...args: any[]): void;

    namespace SoundIntensity {
        namespace prototype {
            function convertTo(...args: any[]): void;

            function roundTo(...args: any[]): void;

            function setData(...args: any[]): void;

            function setID(...args: any[]): void;

            function setName(...args: any[]): void;

            function setType(...args: any[]): void;

            function setUnit(...args: any[]): void;

            function tabulate(...args: any[]): void;

        }

    }

    namespace SoundIntensityLevel {
        namespace prototype {
            function convertTo(...args: any[]): void;

            function roundTo(...args: any[]): void;

            function setData(...args: any[]): void;

            function setID(...args: any[]): void;

            function setName(...args: any[]): void;

            function setType(...args: any[]): void;

            function setUnit(...args: any[]): void;

            function tabulate(...args: any[]): void;

        }

    }

    namespace SoundPower {
        namespace prototype {
            function convertTo(...args: any[]): void;

            function roundTo(...args: any[]): void;

            function setData(...args: any[]): void;

            function setID(...args: any[]): void;

            function setName(...args: any[]): void;

            function setType(...args: any[]): void;

            function setUnit(...args: any[]): void;

            function tabulate(...args: any[]): void;

        }

    }

    namespace SoundPowerLevel {
        namespace prototype {
            function convertTo(...args: any[]): void;

            function roundTo(...args: any[]): void;

            function setData(...args: any[]): void;

            function setID(...args: any[]): void;

            function setName(...args: any[]): void;

            function setType(...args: any[]): void;

            function setUnit(...args: any[]): void;

            function tabulate(...args: any[]): void;

        }

    }

    namespace SoundPressure {
        namespace prototype {
            function convertTo(...args: any[]): void;

            function roundTo(...args: any[]): void;

            function setData(...args: any[]): void;

            function setID(...args: any[]): void;

            function setName(...args: any[]): void;

            function setType(...args: any[]): void;

            function setUnit(...args: any[]): void;

            function tabulate(...args: any[]): void;

        }

    }

    namespace SoundPressureLevel {
        namespace prototype {
            function changeWeight(...args: any[]): void;

            function convertTo(...args: any[]): void;

            function roundTo(...args: any[]): void;

            function setData(...args: any[]): void;

            function setID(...args: any[]): void;

            function setName(...args: any[]): void;

            function setType(...args: any[]): void;

            function setUnit(...args: any[]): void;

            function setWeight(...args: any[]): void;

            function tabulate(...args: any[]): void;

        }

    }

}

export namespace Vector {
    namespace prototype {
        function add(...args: any[]): void;

        function cross(...args: any[]): void;

        function dot(...args: any[]): void;

        function mag(...args: any[]): void;

        function mul(...args: any[]): void;

        function norm(...args: any[]): void;

        function sub(...args: any[]): void;

    }

}

export namespace W2dB {
    const prototype: {
    };

}

export namespace Weight {
    function A(f: any): any;

    function B(f: any): any;

    function C(f: any): any;

    function D(f: any): void;

    function R_a(f: any): any;

    function R_b(f: any): void;

    function R_c(f: any): void;

    function R_d(f: any): void;

    function convert(freq_db_pairs: any): any;

    function h(f: any): void;

}

export namespace airAttenuation {
    const prototype: {
    };

}

export namespace dB2I {
    const prototype: {
    };

}

export namespace dB2W {
    const prototype: {
    };

}

export namespace dB2p {
    const prototype: {
    };

}

export namespace p2dB {
    const prototype: {
    };

}

export namespace units {
    function checkConversion(fromUnit: any, toUnit: any): void;

    function convert(value: any): any;

    namespace convert {
        const prototype: {
        };

    }

}
