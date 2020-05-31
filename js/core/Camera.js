import { Transform } from "./Transform.js";
import { mat4, glMatrix } from "../gl-matrix/index.js";


const X = 0;
const Y = 1;
const Z = 2;



export class Camera
{
    transform = new Transform();
    far = 1000;
    near = 0.01;
    fov = 60;
    
    _projectionMatrix;
    _viewMatrix;

    /**
     * puedo mandarle el aspect o el tamaño del canvas como una lista [width,height]
     * @param { Number } aspect 
     */
    constructor(aspect)
    {
        this.aspect = aspect;
        
        this._viewMatrix = mat4.create();
        this._projectionMatrix = mat4.create();
    }

    get viewMatrix()
    {
        let eye = this.transform.position;
        let up = this.transform.up;
        let forward = this.transform.forward;
        let center = [forward[X]+eye[X] , forward[Y]+eye[Y], forward[Z]+eye[Z]];
        
        mat4.lookAt(this._viewMatrix, eye, center, up);
        return this._viewMatrix;
    }

    get projectionMatrix()
    {
        let fov = glMatrix.toRadian(this.fov);        
        mat4.perspective(this._projectionMatrix, fov, this.aspect, this.near, this.far)
        return this._projectionMatrix;
    }

}