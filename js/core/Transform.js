import { mat4, glMatrix, vec3, quat, vec4, mat3 } from '../gl-matrix/index.js';
import {rotateVector} from '../maths.js';
/**
 * La clase Transform es la encargada de 
 * manejar la modelMatrix de las distintas entidades de la escena
 */


let auxMatrix = mat4.create();

export class Transform 
{
    // usar como publicos : 
    /** @type number[] */
    position;
    /** @type number[] */
    scale;
    /** @type number[] */
    rotation;
    // tratar como privados :
    _localMatrix;    
    _normalMatrix;    
    _right = [1,0,0];
    _up = [0,1,0];    
    _forward = [0,0,1];

    constructor()
    {
        this.position = vec3.create();
        this.scale = vec3.fromValues(1,1,1);
        this.rotation = quat.create();
        this._localMatrix = mat4.create();        
        this._normalMatrix = mat4.create();        
    }


    get localMatrix() 
    {
        this.loadLocalMatrix();
        return this._localMatrix;
    }

    loadLocalMatrix() 
    {
        mat4.identity(this._localMatrix);
        mat4.fromScaling(auxMatrix, this.scale); // cargo la escala                 
        mat4.multiply(this._localMatrix, auxMatrix, this._localMatrix);
        mat4.fromQuat(auxMatrix, this.rotation); // meto el cuaternio en una matriz
        mat4.multiply(this._localMatrix, auxMatrix, this._localMatrix); // multiplico por esa matriz (lo roto)
        mat4.fromTranslation(auxMatrix, this.position);
        mat4.multiply(this._localMatrix, auxMatrix, this._localMatrix);
    }

    get normalMatrix()
    {        
        this.loadLocalMatrix();
        mat4.transpose(this._normalMatrix, this._localMatrix);
        mat4.invert(this._normalMatrix, this._normalMatrix);
        //mat4.fromQuat(this._normalMatrix, this.rotation);
        return this._normalMatrix;
    }

    get forward()
    {
        this._forward[0] = 0;
        this._forward[1] = 0;
        this._forward[2] = 1;
        rotateVector(this._forward, this.rotation, this._forward);        
        return this._forward;
    }
    get right()
    {
        this._right[0] = 1;
        this._right[1] = 0;
        this._right[2] = 0;
        rotateVector(this._right, this.rotation, this._right);        
        return this._right;
    }
    get up()
    {
        this._up[0] = 0;
        this._up[1] = 1;
        this._up[2] = 0;
        rotateVector(this._up, this.rotation, this._up);        
        return this._up;
    }

}

// TODO : aun se pueden optimizar las cuentas de up right y forward 
// porque hay muchos productos por 0 y por 1 en el producto con el cuaternio