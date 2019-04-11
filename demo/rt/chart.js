import d3 from '../d3.js';

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var zoom = d3.zoom()
    .on("zoom", zoomed);

var x = d3.scaleLinear()
    .domain([0, 6.5])
    .range([-1, width + 1]);

var y = d3.scaleLinear()
    .domain([0, 3])
    .range([height + 1, -1]);

let line = d3.line()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]))

var xAxis = d3.axisTop(x)
    .ticks((width + 2) / (height + 2) * 10)
    .tickSize(-height)
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

const strokeWidth = 3;

let chartData = [];

export function addChartData(data, color = `rgba(${Math.random()*150},${Math.random()*150},${Math.random()*150},0.75)`) {
    let newdata = svg.append("path")
        .datum(data)
        .attr("class", "chartdata")
        .attr("d", line)
        .attr("style", `stroke-width: ${strokeWidth}; stroke: ${color};`)
        .attr('transform', 'translate(0,0) scale(1,1)');
    chartData.push(newdata);
}

window.clearChartData = () => {
    svg.selectAll('.chartdata').remove();
}


d3.select("svg")
    .on("dblclick", resetted);

svg.call(zoom);


function zoomed() {

    view.attr("transform", d3.event.transform);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));

    chartData.forEach((x, i, a) => {
        let stroke = a[i].style('stroke');
        a[i].attr("transform", `translate(${d3.event.transform.x},${d3.event.transform.y}) scale(${d3.event.transform.k},${d3.event.transform.k})`);
        a[i].attr("style", `stroke-width: ${strokeWidth / d3.event.transform.k}; stroke: ${stroke}`);
    });
}

function resetted() {
    svg.transition()
        .duration(200)
        .call(zoom.transform, d3.zoomIdentity);
}
