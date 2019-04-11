function doneLoading(b, filename) {
    filename = filename.split('.').slice(0, -1).join('.').concat('.txt');
    var numChannels = b.numberOfChannels;
    var datastr = "";
    if (b.numberOfChannels > 1) {
        var dataL = b.getChannelData(0);
        var dataR = b.getChannelData(1);
        for (var i = 0; i < dataL.length; i++) {
            datastr += `${dataL[i]},${dataR[i]},\n`;
        }
    } else {
        var data = b.getChannelData(0);
        for (var i = 0; i < data.length; i++) {
            datastr += `${data[i]},\n`;
        }
    }
    download(datastr, filename, 'text/plain');
}




export function getSampleData(file, successCallback, errorCallback) {
    var filename = file.name;
    console.log(file); //1

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();

    var req = new XMLHttpRequest();
    var url = URL.createObjectURL(file);

    req.open('GET', url);
    req.responseType = 'arraybuffer';
    req.onload = event => {
        audioCtx.decodeAudioData(
            req.response,
            decodedBuffer => successCallback(decodedBuffer),
            error => errorCallback(error)
        );
    };
    req.send();
}
