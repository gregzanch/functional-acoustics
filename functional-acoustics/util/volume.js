import sum from './sum';

/**
 * From https://stackoverflow.com/questions/1406029/how-to-calculate-the-volume-of-a-3d-mesh-object-the-surface-of-which-is-made-up
 * 
 * Read this paper http://chenlab.ece.cornell.edu/Publication/Cha/icip01_Cha.pdf
 * The trick is to calculate the signed volume of a tetrahedron -
 * based on your triangle and topped off at the origin.
 * The sign of the volume comes from whether your triangle is 
 * pointing in the direction of the origin. (The normal 
 * of the triangle is itself dependent upon the order of your 
 * vertices, which is why you don 't see it explicitly referenced below.)
 * 
 * @function triangleVolume - Calculates the signed volume of a triangle for 3D mesh calc
 * @param  {Object|Vector} p1 - Vector p1 containing components x,y,z;
 * @param  {Object|Vector} p2 - Vector p1 containing components x,y,z;
 * @param  {Object|Vector} p3 - Vector p1 containing components x,y,z;
 * @returns {Number} - Returns signed volume of a triangle
 */
export const triangleVolume = (p1, p2, p3) => {
    const v321 = p3.x * p2.y * p1.z;
    const v231 = p2.x * p3.y * p1.z;
    const v312 = p3.x * p1.y * p2.z;
    const v132 = p1.x * p3.y * p2.z;
    const v213 = p2.x * p1.y * p3.z;
    const v123 = p1.x * p2.y * p3.z;
    return (1.0 / 6.0 ) * (-v321 + v231 + v312 - v132 - v213 + v123);
}
/**
 * @function meshVolume - Calculates the volume of a mesh of triangles
 * @param  {Object[]} mesh - Array of triangles of the form [ {x,y,z}, {x,y,z}, {x,y,z} ]
 */
export const meshVolume = (triangles) => {
    
    const vols = triangles.map(tri => triangleVolume(...Object.keys(tri).map(u => tri[u])));
    return Math.abs(sum(vols));

}

