const Signal = {
    PureTone: (params) => {
        let frequency = params.frequency || 440;
        let length = params.length || 1;
        let gain = params.gain || 1;
        let samplerate = params.samplerate || 44100;
        let buffersize = params.buffersize || 1024;
        let n = samplerate * length;
        let s = [];
        let j = [];
        let k = 0;
        for (let i = 0; i < n; i++) {
            j.push(gain * Math.sin(2 * Math.PI * frequency * i / samplerate));
            if (j.length == buffersize) {
                s.push(j);
                j = [];
            }
        }
        s.push(j);
        return s;
    }
}

export default Signal;