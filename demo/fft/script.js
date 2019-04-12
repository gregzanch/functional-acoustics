import AC from '../functional-acoustics.js';
import { getSampleData } from './audiofileutils.js';
import d3 from './d3.js';

window.AC = AC;
let keys = [];
window.keys = keys;
const buffersize = 4096;

const fileinput = document.getElementById('fileinput');
fileinput.addEventListener("change", e => {
    getSampleData(e.target.files[0], result => handleresult(result), err=>console.error(err));
})

function handleresult(result) {
    console.log(result.getChannelData(0));
    let fftdata = AC.Buffer(result.getChannelData(0), buffersize)
      .map(x => AC.Hann(buffersize).map((n, i) => n * x[i]))
        .map(x => AC.FFT(x)());
    fftdata.pop();
    window.result = result;
    window.fftdata = fftdata;

    clearChartData();
    let avgfftdata = math.transpose(math.transpose(fftdata.map(x => x.real)).map(x => math.sum(x)));
    addChartData(avgfftdata.map((x, i, a) => [i, Math.abs(x)]), `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.75)`)
    window.avgfftdata = avgfftdata;
}

const strokeWidth = 2;

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var zoom = d3.zoom()
    .on("zoom", zoomed);

let line = d3.line()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]))

var view = svg.append("rect")
    .attr("class", "view")
    .attr("x", 0.5)
    .attr("y", 0.5)
    .attr("width", width - 1)
    .attr("height", height - 1);


var x = d3.scaleLinear()
    .domain([0, buffersize / 2])
    .range([-1, width + 1]);

var y = d3.scaleLinear()
    .domain([600, 0])
    .range([-1, height + 1]);

var xAxis = d3.axisBottom(x)
    .ticks((width + 2) / (height + 2) * 10)
    .tickSize(height)
    .tickPadding(8 - height);

var yAxis = d3.axisRight(y)
    .ticks(10)
    .tickSize(width)
    .tickPadding(8 - width);

var gX = svg.append("g")
    .attr("class", "axis")
    .call(xAxis);

var gY = svg.append("g")
    .attr("class", "axis")
    .call(yAxis);

let chartData = [];

function addChartData(data, color = "rgba(0, 162, 255, 0.603)") {
    let newdata = svg.append("path")
        .datum(data)
        .attr("class", "chartdata")
        .attr("d", line)
        .attr("style", `stroke-width: ${strokeWidth}; stroke: ${color};`)
        .attr('transform', 'translate(0,0) scale(1,1)');
    chartData.push(newdata);
}
function clearChartData() {
    svg.selectAll('.chartdata').remove();
}


d3.select("svg")
    .on("dblclick", resetted);

svg.call(zoom);

const translate = {
    x: 0,
    y: 0
};

const scale = {
    x: 1,
    y: 1
};

function zoomed() {

    view.attr("transform", d3.event.transform);

    
    gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
    const regex = /translate\((-?\d+\.?\d*)\,?(-?\d+\.?\d*)?\)\sscale\((-?\d+\.?\d*)\,?(-?\d+\.?\d*)?\)/gmi;
    chartData.forEach((x, i, a) => {
       
        let m;
        while ((m = regex.exec(a[i].attr('transform'))) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            translate.x = m[1];
            translate.y = m[2];
            scale.x = m[3];
            scale.y = m[4];
            
        }
        let stroke = a[i].style('stroke');
        a[i].attr("transform", `translate(${d3.event.transform.x},${d3.event.transform.y}) scale(${d3.event.transform.k},${d3.event.transform.k})`);
        a[i].attr("style", `stroke-width: ${strokeWidth / d3.event.transform.k}; stroke: ${stroke}`);
    });


}

function resetted() {
    svg.transition()
        .duration(200)
        .call(zoom.transform, new d3.Transform(1,0,0));
}

function rescaleAxes() {
    var x = d3.scaleLinear()
        .domain([0, buffersize / 2])
        .range([-1, width + 1]);

    var y = d3.scaleLinear()
        .domain([30, 0])
        .range([-1, height + 1]);

    var xAxis = d3.axisBottom(x)
        .ticks((width + 2) / (height + 2) * 10)
        .tickSize(height)
        .tickPadding(8 - height);

    var yAxis = d3.axisRight(y)
        .ticks(10)
        .tickSize(width)
        .tickPadding(8 - width);

    var gX = svg.append("g")
        .attr("class", "axis")
        .call(xAxis);

    var gY = svg.append("g")
        .attr("class", "axis")
        .call(yAxis);
}

window.addEventListener('keydown', e => {
    keys[e.key] = true;
    console.log(keys);
});

window.addEventListener('keyup', e => {
    keys[e.key] = false;
    console.log(keys);
});

