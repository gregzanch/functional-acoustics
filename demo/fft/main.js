import d3 from './d3.js';
import AC from '../functional-acoustics.js';
import tups from './rt60tups.js';


const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

import data from './res/Harard.js';
window.manual = manual;
window.samples = data.map(x => x.sample);
window.fromInvoices = fromInvoices;
window.d3 = d3;
window.AC = AC;
Window.FFT = AC.FFT;
// Object.keys(AC).forEach(key => {
//     window[key] = AC[key];
// });

window.samples = window.samples.slice(0, 8192);

new AC.Measurement('measurement_id')
    .setName('myMeasurement')
    .setType('measurement-type')
    .setFrequency(AC.Bands.Octave.fromRange(500, 1000))
    .addData([90, 80])
    .withName('spl @ some position')
    .ofType('lp')
    .withWeight('z')
    .changeWeight('a')
    .changeWeight('b')
    .changeWeight('c')
    .changeWeight('d')

const buffersize = 512;

const time = AC.Buffer(tups.map(x => x[0]), buffersize);
const samples = AC.Buffer(tups.map(x => x[1]), buffersize);
const rms = samples.map(x => 20 * Math.log10(AC.RMS(x) + AC.Constants.EPSILON));

let exportdata = {
    time: time.map(x => x[0]),
    samples: rms.map(x => x)
}

let rt60 = d3.range(exportdata.samples.length).map(i => ({
    time: exportdata.time[i],
    sample: exportdata.samples[i]
}));

let s = AC.Signal.PureTone({frequency: 8000}).flat();
let sine = d3.range(4000).map(x => [x,s[x]]);
let freq = AC.FFT(sine.map(x => x[1]))().real.map((x, i) => ([i,x]));

console.log(freq);
const strokeWidth = 2;

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var zoom = d3.zoom()
    .on("zoom", zoomed);

var x = d3.scaleLinear()
    .domain([0, sine.length])
    .range([-1, width + 1]);

var y = d3.scaleLinear()
    .domain([-4, 4])
    .range([-1, height + 1]);

let line = d3.line()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]))

var xAxis = d3.axisBottom(x)
    .ticks((width + 2) / (height + 2) * 10)
    .tickSize(height)
    .tickPadding(8 - height);

var yAxis = d3.axisRight(y)
    .ticks(10)
    .tickSize(width)
    .tickPadding(8 - width);

var view = svg.append("rect")
    .attr("class", "view")
    .attr("x", 0.5)
    .attr("y", 0.5)
    .attr("width", width - 1)
    .attr("height", height - 1);

var gX = svg.append("g")
    .attr("class", "axis")
    .call(xAxis);

var gY = svg.append("g")
    .attr("class", "axis")
    .call(yAxis);


let chartdata = svg.append("path")
    .datum(sine)
    .attr("class", "line")
    .attr("d", line)
    .attr("style", `stroke-width: ${strokeWidth}`)

let freqdata = svg.append("path")
    .datum(freq)
    .attr("class", "line")
    .attr("d", line)
    .attr("style", `stroke-width: ${strokeWidth}`)

d3.select("svg")
    .on("dblclick", resetted);

svg.call(zoom);


function zoomed() {
    console.log(d3.event.transform);
    view.attr("transform", d3.event.transform);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
    chartdata.attr("transform", d3.event.transform);
    chartdata.attr("style", `stroke-width: ${strokeWidth / d3.event.transform.k}`);
    freqdata.attr("transform", d3.event.transform);
    freqdata.attr("style", `stroke-width: ${strokeWidth / d3.event.transform.k}`);
}

function resetted() {
    svg.transition()
        .duration(200)
        .call(zoom.transform, d3.zoomIdentity);
}
