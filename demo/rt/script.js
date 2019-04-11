import AC from '../functional-acoustics.js';
import { addChartData } from './chart.js';
import { saveAs } from './FileSaver.js';
import { RTOptimizer } from './RT.js';

window.AC = AC;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;


document.getElementById('solver').addEventListener('click', e => {
    let elm = document.getElementById(e.target.getAttribute('for'));
    elm.classList.toggle('hidden');
    if (elm.classList.contains('hidden')) {
        e.target.value = e.target.value.replace('hide', 'show');
    }
    else {
         e.target.value = e.target.value.replace('show', 'hide');
    }
    
})

const open = document.getElementById('open').addEventListener('click', e => {
    document.getElementById('fromSave').click();
})
const fromSave = document.getElementById('fromSave');
fromSave.addEventListener('change', e => {
    AC.readTextFile({
        element: e.target,
        loaded: res => {
            openFromSave(res);
            document.getElementById('filename').innerText = e.target.files[0].name;
        },
        error: err => console.log(err)
    })
});
function openFromSave(res) {
    window.room = new RTOptimizer();
    let temproom = JSON.parse(res);
    Object.keys(temproom).forEach(k => {
        room[k] = temproom[k];
    });
    room.surfaces = room.surfaces.map(x => new AC.Surface(x));
    room.surfaces.forEach(x => {
        if (x.children.length > 0) {
            x.children = x.children.map(c => room.getSurfaceByName(c.name));
        }
    });
    room.calculateRT(true);
    addChartData(room.T60.map((x, i) => {
        return [i + 1, x];
    }));
    addChartData(room.goal.map((x, i) => {
        return [i + 1, x];
    }));
    room.graph = (color = `rgba(${Math.random()*150},${Math.random()*150},${Math.random()*150},0.75)`) => {
        addChartData(room.T60.map((x, i) => [i + 1, x]),color);
    }
    room.graphGoal = (color = `rgba(${Math.random()*150},${Math.random()*150},${Math.random()*150},0.75)`) => {
        addChartData(room.goal.map((x, i) => [i + 1, x]), color);
    }
    console.log(room);
    document.getElementById('optimize').addEventListener('click', e => {
        room.optimizePrime(Number(document.getElementById('solverIterations').value));
        room.graph(`rgba(${Math.random()*150},${Math.random()*150},${Math.random()*150},0.25)`);
    })
}
document.getElementById('save').addEventListener('click', e => {
      var text = JSON.stringify(window.room);
    var filename = document.getElementById('filename').innerText !== "~" ? document.getElementById('filename').innerText : "treatment-layout.json";
      var blob = new Blob([text], {
          type: "application/json"
      });
      saveAs(blob, filename);
})



Object.defineProperty(
    Object.prototype,
    'renameProperty', {
        writable: false, // Cannot alter this property
        enumerable: false, // Will not show up in a for-in loop.
        configurable: false, // Cannot be deleted via the delete operator
        value: function (oldName, newName) {
            // Do nothing if the names are the same
            if (oldName == newName) {
                return this;
            }
            // Check for the old property name to 
            // avoid a ReferenceError in strict mode.
            if (this.hasOwnProperty(oldName)) {
                this[newName] = this[oldName];
                delete this[oldName];
            }
            return this;
        }
    }
);


// window.RTOptimizer = RTOptimizer;
// window.room = new RTOptimizer({
//     frequency: [125, 250, 500, 1000, 2000, 4000]
// }).addSurface(new AC.Surface({
//     name: "Front",
//     surfaceArea: 608,
//     materialNumber: 334,
//     materialName: "CMU, painted",
//     materialCoefficients: [0.10, 0.05, 0.06, 0.07, 0.09, 0.08],
//     materialCoefficientFrequencies: [125, 250, 500, 1000, 2000, 4000]
// })).addSurface(new AC.Surface({
//     name: "Left",
//     surfaceArea: 1232,
//     materialNumber: 334,
//     materialName: "CMU, painted",
//     materialCoefficients: [0.20, 0.15, 0.26, 0.37, 0.49, 0.08],
//     materialCoefficientFrequencies: [125, 250, 500, 1000, 2000, 4000]
// })).addSurface(new AC.Surface({
//     name: "Right",
//     surfaceArea: 1232,
//     materialNumber: 334,
//     materialName: "CMU, painted",
//     materialCoefficients: [0.10, 0.05, 0.06, 0.07, 0.09, 0.08],
//     materialCoefficientFrequencies: [125, 250, 500, 1000, 2000, 4000]
// })).addSurface(new AC.Surface({
//     name: "Rear",
//     surfaceArea: 1040,
//     materialNumber: 334,
//     materialName: "CMU, painted",
//     materialCoefficients: [0.10, 0.05, 0.06, 0.07, 0.09, 0.08],
//     materialCoefficientFrequencies: [125, 250, 500, 1000, 2000, 4000]
// })).addSurface(new AC.Surface({
//     name: "Floor",
//     surfaceArea: 5200,
//     materialNumber: 533,
//     materialName: "Vinyl or woodblock floor",
//     materialCoefficients: [0.03, 0.03, 0.03, 0.04, 0.05, 0.05],
//     materialCoefficientFrequencies: [125, 250, 500, 1000, 2000, 4000]
// })).addSurface(new AC.Surface({
//     name: "Ceiling",
//     surfaceArea: 5200,
//     materialNumber: 171,
//     materialName: "Plain steel ceiling planks",
//     materialCoefficients: [0.25, 0.15, 0.10, 0.08, 0.05, 0.05],
//     materialCoefficientFrequencies: [125, 250, 500, 1000, 2000, 4000]
// })).addSurface(new AC.Surface({
//     name: "Stage Opening",
//     surfaceArea: 432,
//     materialNumber: 240,
//     materialName: "Stage Opening, average; depends on set",
//     materialCoefficients: [0.25, 0.35, 0.45, 0.55, 0.65, 0.75],
//     materialCoefficientFrequencies: [125, 250, 500, 1000, 2000, 4000]
// })).addSurface(new AC.Surface({
//     name: "Wall Panels left",
//     surfaceArea: 768,
//     materialNumber: 1004,
//     materialName: "Kinetics Versa Tune Acoustical Wall Panels",
//     materialCoefficients: [0.78, 0.78, 0.86, 0.79, 0.76, 0.77],
//     materialCoefficientFrequencies: [125, 250, 500, 1000, 2000, 4000],
//     isVar: true
// })).addSurface(new AC.Surface({
//     name: "Wall Panels right",
//     surfaceArea: 768,
//     materialNumber: 1004,
//     materialName: "Kinetics Versa Tune Acoustical Wall Panels",
//     materialCoefficients: [0.78, 0.78, 0.86, 0.79, 0.76, 0.77],
//     materialCoefficientFrequencies: [125, 250, 500, 1000, 2000, 4000],
//     isVar: true
// })).addSurface(new AC.Surface({
//     name: "Rear Panels",
//     surfaceArea: 0,
//     materialCoefficients: [0.06, 0.09, 0.48, 0.88, 0.94, 0.71],
//     materialCoefficientFrequencies: [125, 250, 500, 1000, 2000, 4000],
//     isVar: true
// }))





// room.getSurfaceByName("Left").addChild(room.getSurfaceByName("Wall Panels left").setVar(true))
// room.getSurfaceByName("Right").addChild(room.getSurfaceByName("Wall Panels right").setVar(true));
// room.getSurfaceByName("Rear").addChild(room.getSurfaceByName("Rear Panels").setVar(true));

// room.setVolume(104000.00)
//     .setUnits('ft')
//     .setGoal([1.4, 1.5, 1.5, 1.5, 1.45, 1.4])
//     .setIterRate(50)
//     .setIterCount(100)
//     .setStepSize(5)



// console.log(room);

