import {rotateTowards, clamp, X, Y, Z} from "../maths.js";
import { Camera } from "../core/Camera.js";
import { input } from "../core/Input.js";
import { vec3, quat } from "../gl-matrix/index.js";





const angularDrag = 33;
const drag = 6;
const rotationAcceleration = 100;
const acceleration = 20;
const epsilon = 0.001;

let auxVector = [0,0,0]
let auxQuat = [0,0,0,1]

export class OrbitalCam
{   
    /**
     *  con A y D orbitas en torno al punto central (usando tu UP como eje de rotacion)
     *  con S y W te acercas y alejas del punto de rotacion
     *  con Q y E te moves arriba y abajo
     *  con la barra espaciadora haces un roll
     */
    params = 
    {
        viewCenter : [0,0,0],        
        rotationSpeed : 70 ,
        movementSpeed : 5 ,
        maxDistance : 15,
        minDistance : 5,
    }
    
    currentRotationSpeed = 0;
    currentSpeed = 0;
    
    
    /** @type {Camera} */

    camera;
    
    update(dt)
    {
        // actualizo la rapidez de rotacion y movimiento
        this.currentRotationSpeed -= dt * rotationAcceleration * lateralAxis() - dt;
        this.currentSpeed += dt * acceleration * forwardAxis();

        // actualizo nuevamente la rapidez aplicando drag
        let absRotSpeed = Math.abs(this.currentRotationSpeed);
        let absSpeed = Math.abs(this.currentSpeed);

        let deltaDrag = dt * drag;
        let deltaAngularDrag = dt * angularDrag;
        
        if(absRotSpeed - epsilon > deltaAngularDrag)
        {
            this.currentRotationSpeed -= deltaAngularDrag * Math.sign(this.currentRotationSpeed);
        }            
        else
        {
            this.currentRotationSpeed = 0;
        }       
        
        if(absSpeed - epsilon > deltaDrag)
        {
            this.currentSpeed -= deltaDrag * Math.sign(this.currentSpeed);
        }            
        else
        {
            this.currentSpeed = 0;
        }

        // me fijo que la rapidez no se pase de los maximos
        
        this.currentRotationSpeed = clamp(this.currentRotationSpeed, -this.params.rotationSpeed, this.params.rotationSpeed)
        this.currentSpeed = clamp(this.currentSpeed, -this.params.movementSpeed, this.params.movementSpeed)

        // aplico la velocidad de rotacion              

        rotateTowards(this.camera.transform, this.params.viewCenter, this.currentRotationSpeed  * dt, this.camera.transform.up , true );

        // aplico la velocidad de movimiento 

        auxVector[X] = this.params.viewCenter[X] - this.camera.transform.position[X];
        auxVector[Y] = this.params.viewCenter[Y] - this.camera.transform.position[Y];
        auxVector[Z] = this.params.viewCenter[Z] - this.camera.transform.position[Z];

        
       
        
        // si tengo algo de velocidad aplico movimiento (optimizar para ahorrar raices cuadradas del normalize)
        if(Math.abs(this.currentSpeed) > epsilon)
        {
            vec3.normalize(auxVector, auxVector);
            this.camera.transform.position[X] += this.currentSpeed * dt * this.camera.transform.forward[X];
            this.camera.transform.position[Y] += this.currentSpeed * dt * this.camera.transform.forward[Y];
            this.camera.transform.position[Z] += this.currentSpeed * dt * this.camera.transform.forward[Z];
        }

        // me muevo hacia arriba y abajo de manera directa (sin acceleration)
        let up = this.camera.transform.up; // es una property y calcula cosas mejor cachearlo 
        let vertical = verticalAxis();
        this.camera.transform.position[X] += up[X] * dt * this.params.movementSpeed * vertical;
        this.camera.transform.position[Y] += up[Y] * dt * this.params.movementSpeed * vertical;
        this.camera.transform.position[Z] += up[Z] * dt * this.params.movementSpeed * vertical;

      


    }
}



function forwardAxis()
{
    if(input.isPressed.forward && !input.isPressed.back){
        return 1;
    }
    if(input.isPressed.back && !input.isPressed.forward){
        return -1;
    }
    return 0;
}

function lateralAxis()
{
    if(input.isPressed.right && !input.isPressed.left){
        return 1;
    }
    if(input.isPressed.left && !input.isPressed.right){
        return -1;
    }
    return 0;
}

function verticalAxis()
{
    if(input.isPressed.up && !input.isPressed.down){
        return 1;
    }
    if(input.isPressed.down && !input.isPressed.up){
        return -1;
    }
    return 0;
}