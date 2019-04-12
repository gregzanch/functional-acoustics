import AC from '../functional-acoustics.js/index.js';
window.AC = AC;

const input = document.createElement('input');
input.id = 'audiotools-input'
input.type = 'file';
document.body.appendChild(input);

var originalConsole = window.console;
console = {
    log: function (message) {
        originalConsole.log(message);
        document.body.innerHTML += "<p>asldhflakwbfaou;wbfr</p>";
    }
}

const parseAudioToolsFile = (text) => {

}

const handle_audiotools_input = (e) => { 
    read(e.target, (result) => {
        console.log(result);
    })
}

function read(elt,callback) {
    var file = elt.files.item(0);
    var reader = new FileReader();

    reader.onload = function () {
        callback(reader.result);
    }

    reader.readAsText(file);
}


input.addEventListener('change', handle_audiotools_input);



window.reg = /^(\d{1,5}\.?\d+)\t(\d{1,5}\.?\d+)$/gmi;
window.str = `RTA	AudioTools 	v10.21.2 SH Acoustics' iPad (2) battery  75%	1/14/19, 10:59 AM	RTA420 022 Low Range	582952DC-A40E-4911-A0B8-6E042B84FC1D
Frequency	dB
25	39.3
32	42.2
40	44.8
50	47.5
63	57.1
80	67.4
100	70.6
125	72.2
160	74.8
200	76.6
250	77.9
315	78.9
400	79.2
500	79.7
630	80.4
800	80.8
1000	82.5
1250	84.1
1600	83.8
2000	85.8
2500	85.2
3150	82.9
4000	79.3
5000	78
6300	78.8
8000	75.1
10000	69.6
12500	77.7
16000	84.4
20000	84.3
overall dB	94.5 dBA
decay	Average
weighting	Flat
octave mode	1/3 Octave
source	RTA420 022 Low Range
latitude	41.237
longitude	-73.016
saved	1/14/19, 10:59 AM`;
let m;
let freq = [];
let dbs = [];
while ((m = reg.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === reg.lastIndex) {
        reg.lastIndex++;
    }

    freq.push(Number(m[1]));
    dbs.push(Number(m[2]));
}
window.freq = freq;
window.dbs = dbs;