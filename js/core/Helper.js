import {MainLoop} from "./MainLoop.js"
import {GameEntity} from "./GameEntity.js"

export class Helper
{
    /** @type {MainLoop} */
    mainLoop;

    constructor(mainLoop)
    {
        this.mainLoop = mainLoop;
    }

    /**
     * 
     * @param {string} tag 
     */
    getEntitiesByTag(tag)
    {
        return this.mainLoop.updateList.filter( 
        /** @param {GameEntity} entity*/
        (entity,i)=>
        {
            return entity.tag == tag;
        })
    }
    /**
     * 
     * @param {string} tag 
     */
    getEntityByTag(tag)
    {    

        let combinada = [this.mainLoop.updateList , ... this.mainLoop.startQueue]
        //console.log(combinada);
        
        for(let i= 0 ; i < combinada.length ; i++)
        {
            //console.log("comparo en "+combinada[i]+ "con tag : "+tag);
            if(combinada[i].tag == tag)
            {
                return combinada[i];
            }
        }
        
    }

}