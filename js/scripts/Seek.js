import { GameEntity } from "../core/GameEntity.js";
import { quat, vec3, mat3, mat4 , glMatrix} from "../gl-matrix/index.js";
import { Helper } from "../core/Helper.js";
import {setForward} from "../maths.js"

const X = 0;
const Y = 1;
const Z = 2;


export class Seek
{
    params = 
    {
        speed : 1,
        targetTag : "player",
        offset : 4
    }

    auxMat4;    
    auxVec = [0,0,0];

    
    /** @type {GameEntity} */
    target;
    /** @type {Helper} */
    helper;



    start()
    {
        
        this.auxVec = vec3.create();        
        this.target = this.helper.getEntityByTag(this.params.targetTag);
        if(!this.target)
        {
            console.log("error, no hay target con tag : "+this.params.targetTag);            
        }
    }

    /**
     * 
     * @param {number} dt 
     * @param {GameEntity} entity 
     */
    update(dt, entity)
    {
        if(!this.target) return; // JIC

        // obtengo la direccion hacia mi objetivo
        let pos = entity.transform.position;
        let targetPos = this.target.transform.position;

        this.auxVec =  this.target.transform.right;

        let offsetX =  this.auxVec[X]; // que tiene el right del target
        let offsetY =  this.auxVec[Y]; // que tiene el right del target
        let offsetZ =  this.auxVec[Z]; // que tiene el right del target

        this.auxVec[X] = targetPos[X] - pos[X] ;
        this.auxVec[Y] = targetPos[Y] - pos[Y] ;
        this.auxVec[Z] = targetPos[Z] - pos[Z] ;

        this.auxVec[X] += offsetX * this.params.offset;
        this.auxVec[Y] += offsetY * this.params.offset;
        this.auxVec[Z] += offsetZ * this.params.offset;

        vec3.normalize(this.auxVec, this.auxVec);
            
        setForward(pos, targetPos, entity.transform.up, entity.transform.rotation);

        this.auxVec = entity.transform.forward;

        //console.log(this.auxVec)

        entity.transform.position[X] += dt * this.params.speed * this.auxVec[X];
        entity.transform.position[Y] += dt * this.params.speed * this.auxVec[Y];
        entity.transform.position[Z] += dt * this.params.speed * this.auxVec[Z];


        
    }

}