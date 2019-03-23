import AC from "../functional-acoustics";

const m = new AC.Measurement({
    data: [
        {
            type: 'frequency',
            symbol: 'f',
            name: 'Frequency (Hz)',
            value: [125, 250, 500, 1000],
            units: 'Hz'
        },
        {
            type: 'sound power',
            symbol: 'Lw',
            name: 'Lw dB-Z (re: 10^-12 W)',
            value: [80, 90, 43, 32],
            units: 'dB-Z'
        }
    ]
    
})