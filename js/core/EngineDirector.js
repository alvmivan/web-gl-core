import { SceneLoader, loadPrefab } from "./SceneLoader.js";
import { GetLoop, MainLoop } from "./MainLoop.js";
import { ForwardRender } from "./Pipelines.js";

export class EngineDirector
{
    /** @type {SceneLoader} */
    sceneLoader;
    /** @type {ForwardRender} */
    pipeline;
    /** @type {MainLoop} */
    loop;

    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     */
    async initialize(gl)
    {
        this.pipeline = new ForwardRender(gl);
        

        this.sceneLoader = new SceneLoader()
        this.sceneLoader.clean();
        let sceneData = await this.sceneLoader.loadMainScene(gl);
        
        
        
        this.pipeline.cameraScripts = sceneData.cameraData.scripts; 

        this.pipeline.initPipeline();  
        
        this.loop = GetLoop(gl);
        this.loop.pipeline = this.pipeline;
        this.loop.add(sceneData.entities);
        
        this.sceneLoader.clean();

              
        this.loop.run();


        

       // // to test gizmos : 
//
       // let gizmosData = await loadPrefab(gl, "gizmos.json");
//
       // this.loop.add(gizmosData.entities);
//
        console.log(" --- Loading Completed --- ")

    }

    
}