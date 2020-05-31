import { glMatrix, mat4 } from "../gl-matrix/index.js";
import { Transform } from "./Transform.js";


const X = 0;
const Y = 1;
const Z = 2;



export class Camera
{
    transform = new Transform();

    // si le hacemos property setter a alguno de estos 4, recordar llamar a recalculateProjectionMatrix
    _far;   
    _near;  
    _fov;    
    _aspect; 

    _projectionMatrix;
    _viewMatrix;

    /**
     * puedo mandarle el aspect o el tamaño del canvas como una lista [width,height]
     * @param { Number } aspect 
     */
    constructor(aspect)
    {
        this._aspect = aspect;        
        this._viewMatrix = mat4.create();
        this._projectionMatrix = mat4.create();
        this.recalculateProjection();
    }

    /**
     * @param {number} value
     */
    set aspect(value)
    {
        if(Math.abs(this._aspect - value) > 0.00001)
        {
            this._aspect = value;
            this.recalculateProjection();
        }        
    }
    /**
     * @param {number} value
     */
    set fov(value)
    {
        if(Math.abs(this._fov - value) > 0.00001)
        {
            this._fov = value;
            this.recalculateProjection();
        }        
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
        return this._projectionMatrix;
    }


    recalculateProjection() 
    {
        let radFOV = glMatrix.toRadian(this._fov);
        mat4.perspective(this._projectionMatrix, radFOV, this._aspect, this._near, this._far);
    }
}