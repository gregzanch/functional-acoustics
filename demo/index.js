const AC = require('../functional-acoustics');


let dBsum1d = AC.dBsum(
    [90, 90]
)

let dBsum2d = AC.dBsum([
    [90, 90],
    [80, 80]
])

let dBsum3d = AC.dBsum([
    [
        [90, 90],
        [80, 80]
    ],
    [
        [70, 70],
        [60, 60]
    ]
])

console.log(dBsum1d, dBsum2d, dBsum3d);

let modes = AC.RoomModes({
    length: 19,
    width: 14,
    height: 10,
});

console.log(modes);