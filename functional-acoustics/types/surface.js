import triangleArea from '../util/area';
import {
    Vector
} from './vector';

export class Surface {
    constructor({
        name,
        faces,
        surfaceArea,
        materialNumber,
        isVar,
        hasParent,
        children,
        materialCoefficients
    } = {}) {
        this.name = name || "new surface";
        this.faces = faces || [];
        this.surfaceArea = surfaceArea;
        this.modifiedSurfaceArea = surfaceArea;
        this.materialNumber = materialNumber;
        this.isVar = isVar || false;
        this.hasParent = hasParent || false;
        this.children = children || [];
        this.materialCoefficients = materialCoefficients || [];
        this.resolveSabins();
    }
    resolveSabins() {
       
        if (this.materialCoefficients.length > 0) {
            this.sabins = this.materialCoefficients.map(
                x => x * this.modifiedSurfaceArea
            );
        }
    
    }
    addChild(surface) {
        if (surface.hasParent) {
            throw surface.name + " Cannot have more than one parent!"
        } else {
            this.children.push(surface);
            this.children[this.children.length - 1].hasParent = true;
        }
        return this;

    }
    setVar(isVar) {
        this.isVar = isVar;
        return this;
    }
}