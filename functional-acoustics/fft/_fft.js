import {
  transform,
  convolveReal,
  inverseTransform,
  newArrayOfZeros
} from "./fft.js";


export function FFT(signal) {
    let _signal = Array.from(signal);
    if (_signal instanceof Array) {
      if (_signal[0] instanceof Array) {
        _signal.map(x => transform(x, newArrayOfZeros(x.length)));
      } else {
        transform(_signal, newArrayOfZeros(_signal.length));
      }
    }
    return _signal;
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
