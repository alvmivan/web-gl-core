import {setForward, rotateTowards, clamp, X, Y, Z, rotateVector} from "../maths.js";
import { Camera } from "../core/Camera.js";
import { input } from "../core/Input.js";
import { vec3, quat } from "../gl-matrix/index.js";
import { GameEntity } from "../core/GameEntity.js";
import { Helper } from "../core/Helper.js";




let auxQuat = [0,0,0,1]

export class Orbit
{   
    
    params =
    {
        target : "deathstar",
        speed : 2,
        offset : [0,0,90],
        self : false
    }

    /** @type {Helper} */
    helper;

    axis = [0,1,0]

    rotated = false;

    start()
    {
        this.target = this.helper.getEntityByTag(this.params.target);
        
    }

    /**
     * 
     * @param {number} dt 
     * @param {GameEntity} entity 
     */
    update(dt, entity)
    {
        if(!this.target) return; // JIC
        let targetPos ;
        let pos = entity.transform.position;
        if(this.params.self)
        {
            targetPos = pos;
        }
        else{
            targetPos = this.target.transform.position
        }
        
        if(this.params.axis)
        {
            this.axis = this.params.axis;
        }
        
        rotateTowards(entity.transform, targetPos, dt * - this.params.speed * 10, this.axis);        
        

    }
}


