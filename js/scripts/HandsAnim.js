import { GameEntity } from "../core/GameEntity.js";
import { quat, vec3 } from "../gl-matrix/index.js"

export class HandAnim
{
    params = {}

    auxQuat;

    ang = 0
    vel = 180;

    start()
    {
        this.auxQuat = quat.create();
        this.auxVec = vec3.create();
        if(this.params.left)
        {
            this.vel *= -1;
        }
    }

    /**
     * 
     * @param {number} dt 
     * @param {GameEntity} entity 
     */
    update(dt, entity)
    {
        const max = 60;
        this.ang += dt * this.vel;
        
        if(Math.abs(this.ang) > max)
        {
            this.vel *= -1;
            this.ang = (max-0.1) * Math.sign(this.ang);
        }

        quat.fromEuler(entity.transform.rotation, 0,0, this.ang);
        
    }

}