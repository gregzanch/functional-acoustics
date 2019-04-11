import {
    transform,
    convolveReal,
    inverseTransform
} from './fft.js';

export const FFT = (real) => (imag) => {
    const re = [];
    real.forEach((v, i, a) => {
        re.push(v);
    });

    if (!imag) {
        const im = [];
        real.forEach((v, i, a) => {
            im.push(0);
        });
        const transformdata = {
            real: re,
            imag: im
        } 
        transform(transformdata.real, transformdata.imag);
        return transformdata;
    }
    else {
        const im = [];
        if (imag) {
            imag.forEach((v, i, a) => {
                im.push(v);
            })
        }
        const transformdata = {
            real: Object.assign(real, re),
            imag: Object.assign(real, im)
        };
        transform(transformdata.real, transformdata.imag);
        return transformdata;
    }
}

export const IFFT = real => imag => {
        const re = [];
        real.forEach((v, i, a) => {
            re.push(v);
        });
        if (!imag) {
            const im = [];
            real.forEach((v, i, a) => {
                im.push(0);
            });
            const transformdata = {
                real: re,
                imag: im
            }
            inverseTransform(transformdata.real, transformdata.imag);
            return transformdata;
        } else {
            const im = [];
            if (imag) {
                imag.forEach((v, i, a) => {
                    im.push(v);
                })
            }
            const transformdata = {
                real: Object.assign(real, re),
                imag: Object.assign(real, im)
            };
            inverseTransform(transformdata.real, transformdata.imag);
            return transformdata;
        }
}
