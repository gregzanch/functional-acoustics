import Weight from './weight'
import Conversion from './conversion'
import Bands from './bands/bands'
import dBAdd from './functions/dBAdd'
import dBsum from './functions/dBsum'
// import Barrier from './barrier'
import Properties from './properties'
// import Measurement from './measurement'
import RoomModes from './modal/room-modes'

const Acoustics = {
    Weight: Weight,
    Conversion: Conversion,
    Bands: Bands,
    dBAdd: dBAdd,
    dBsum: dBsum,
    // Barrier: Barrier,
    Properties: Properties,
    // Measurement: Measurement,
    RoomModes: RoomModes
};

export default Acoustics;