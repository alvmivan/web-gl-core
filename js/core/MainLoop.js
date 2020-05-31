import { ForwardRender } from "./Pipelines.js";
import { GameEntity } from "./GameEntity.js";
import { Helper } from "./Helper.js";

/** @type MainLoop */
let engine;
/**
 * @type {Helper}
 */
let helper;

export class MainLoop
{
    gl
    last
    startQueue = []
    updateList = []
    destroyQueue = []
    /** @type {ForwardRender} */
    pipeline;

    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(gl)
    {
        this.gl = gl;
    }
    
    add(elem)
    {
        if(Array.isArray(elem))
        {

            elem.forEach((e)=>
            {
                engine.startQueue.push(e);
            });    
        }
        else
        {
            engine.startQueue.push(elem);
        }        
    }

    remove(elem)
    {
        if(Array.isArray(elem))
        {
            elem.forEach(engine.destroyQueue.push);    
        }
        else
        {
            engine.destroyQueue.push(elem);
        } 
    }

    run()
    {
        engine.last = Date.now();        
        requestAnimationFrame(engine.tick);
    }

    tick() 
    {     
        let gl = engine.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const now = Date.now();
        const dt = (now - engine.last) / 1000;
        engine.last = now;

        let fpsCount = 1/dt;
        fps.innerHTML = "FPS : " + fpsCount.toFixed(0);

        while(engine.startQueue.length > 0)
        {
            let elem = engine.startQueue.pop()
            elem.setHelper(helper) ;

            if(elem.start)
            {
                elem.start();
            }
            
            engine.updateList.push(elem);
        }

        while(engine.destroyQueue.length > 0)
        {
            let elem = engine.destroyQueue.pop()            
            let i = engine.updateList.indexOf(elem)         
            engine.updateList[i] = engine.updateList[engine.updateList.length-1] // its a bag <3 
            engine.updateList.pop()
            elem.clear()
        }   


        //updateo las entidades
        engine.updateList.forEach( /** @param {GameEntity} elem */ elem => 
        {
            elem.update(dt);
        });

        // preparo el pipeline para el frame
        engine.pipeline.preRender(dt);

        // renderizo las entidades
        engine.updateList.forEach( /** @param {GameEntity} elem */ elem => 
        {
            engine.pipeline.render(elem.renderer, elem.transform);            
        });

        
        
    
      // if ( axisCheckbox.checked ) {
      //     engine.worldAxis.render();
      // }

        requestAnimationFrame(engine.tick)
    }
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @returns {MainLoop} 
 */
export function GetLoop(gl)
{        
    if(engine)
    {
        return engine;
    }
    
    engine = new MainLoop(gl);
    helper = new Helper(engine);
    return engine;
}