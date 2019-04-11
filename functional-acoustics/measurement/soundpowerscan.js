import { dB2I, W2dB } from '../db/2dB2';

/** Determination of sound power levels of noise sources using sound intensity by scanning
 * @param  {Number[]} freq Array of frequencies 
 * @param  {Object[]} surfaces Array of objects with members SurfaceArea: Number and SoundIntensityLevel: Number[]
 */
export function SoundPowerScan({ frequency, surfaceData } = {}) {
    let sum = Array(frequency.length).fill(0);
    surfaceData.forEach((surface, index, arr) => {
        arr[index].SoundIntensity = dB2I({
            dB: surface.SoundIntensityLevel
        });
        arr[index].SoundPower = arr[index].SoundIntensity.map(x => x * surface.SurfaceArea);
        arr[index].SoundPower.forEach((s, i) => {
            sum[i] += s;
        });
    });
    let SoundPowerLevel = W2dB({
        W: sum
    });

    return SoundPowerLevel;
}