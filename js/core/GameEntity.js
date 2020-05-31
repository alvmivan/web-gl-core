import { Transform } from "./Transform.js";
import { MeshRenderer } from "./MeshRenderer.js";
import { Helper } from "./Helper.js";

export class GameEntity
{

    

    /** @type {string} */
    tag;

    transform = new Transform();
    /**@type {MeshRenderer} */
    renderer;
    /**@type {Array<
     * {
        *  start: ()=>any
        *  update: (dt:Number)=> any
        *  clear: ()=> any
        * }>} */
    scripts;

    /**
     * @param {Array<
     * {
     *  start: ()=>any
     *  update: (dt:Number)=> any
     *  clear: ()=> any
     * }>} scripts
     * @param {MeshRenderer} renderer 
     */
    constructor(renderer)
    {    
        this.renderer = renderer;
        this.scripts = [];
    }

    setHelper(helper)
    {
        if(this.scripts)
        {
            this.scripts.forEach(script=>{
                script.helper = helper;
            });
        } 
    }

    start(){
        if(this.scripts)
        {
            this.scripts.forEach(script=>{
                if(script.start)
                    script.start();
            });
        }
    }

    update(dt)
    {
        let self = this;
        if(this.scripts)
        {
            this.scripts.forEach(script=>{
                if(script.update)
                    script.update(dt, self);
            });
        }
    }

    clear(){
        if(this.scripts)
        {
            this.scripts.forEach(script=>{
                if(script.clear)
                    script.clear();
            });
        }
    }



        




}