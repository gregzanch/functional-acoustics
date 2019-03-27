import sum from '../util/sum';
import mean from '../util/mean';
import volume from '../util/geometry/volume';
import {vec2,vec3,vec4,add,sub,dot,norm} from '../util/geometry/vector';
import triangle from '../util/geometry/triangle';
import objParse from '../util/geometry/obj';
import area from '../util/geometry/area';

const RT = { sum, mean, volume, vec2, vec3, vec4, triangle, objParse, area,add,sub,dot,norm };
export default RT;