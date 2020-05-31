import { Camera } from "./Camera.js";
import { MeshRenderer } from "./MeshRenderer.js";
import { mat4 , glMatrix, quat, vec3} from "../gl-matrix/index.js";
import { rotateVector, clamp } from "../maths.js"
//import { AND, CompositeRenderer } from "./CompositeRenderer.js";
import { Transform } from "./Transform.js";




export class ForwardRender 
{
    /** @type {WebGL2RenderingContext} */
    gl;
    clearColor = [.09,.09,.095,1];
    /** @type {Camera} */
    camera;
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(gl)
    {
        this.gl = gl;
    }

    cameraScripts = []

    initPipeline()
    {            
        this.gl.clearColor(this.clearColor[0],this.clearColor[1],this.clearColor[2],this.clearColor[3]);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.camera = new Camera( this.gl.canvas.width / this.gl.canvas.height );
        
        this.camera.transform.position[0] = 4;
        this.camera.transform.position[1] = 2;
        this.camera.transform.position[2] = 0;   

        quat.rotateY(this.camera.transform.rotation,this.camera.transform.rotation,glMatrix.toRadian(-90))
        quat.rotateX(this.camera.transform.rotation,this.camera.transform.rotation,glMatrix.toRadian(10))

        // todo : deshardcodear
        
        this.cameraScripts.forEach(s=>
        {
            s.camera = this.camera;            
        });

    }

    /**@type {Float32Array} */    
    viewMatrix
    /**@type {Float32Array} */
    projectionMatrix

    rotate = true;
    acercar = true;
    

    preRender(dt)
    {
        this.viewMatrix = this.camera.viewMatrix;
        this.projectionMatrix = this.camera.projectionMatrix;
        // todo: aca updateariamos el script de la camara
        

        this.cameraScripts.forEach(s=>
            {
                if (s.update){
                    s.update(dt);
                }
            });


    }

    /**
     * 
     * @param {MeshRenderer} renderer 
     * @param {Transform} transform
     */
    render(renderer, transform)
    {

        let localMatrix = transform.localMatrix;
        let normalMatrix = transform.normalMatrix;

        let count = renderer.count;
        let material = renderer.material;
        let vao = renderer.vao;
        let renderMode = renderer.renderMode;

        //if(renderer.rendererType == AND)
        //{
        //    /** @type {CompositeRenderer} */
        //    let compo = renderer;       
        //    for (let i = 0 ; i<compo.renderers.length ; i++)
        //    {
        //        count = compo.renderers[i].count;
        //        material = compo.renderers[i].material;
        //        vao = compo.renderers[i].vao;
        //        renderMode = compo.renderers[i].renderMode;
        //        this._internalRender(material, localMatrix, normalMatrix, vao, renderMode, count);
        //    }
        //}
        //else
        //{
            this._internalRender(material, localMatrix, normalMatrix, vao, renderMode, count); // limpio el binder
        //}

        
    }


    _internalRender(material, localMatrix, normalMatrix, vao, renderMode, count) 
    {
        let modelMatrixLocation = material.modelMatrixLocation;
        let normalMatrixLocation = material.normalMatrixLocation;
        let viewMatrixLocation = material.viewMatrixLocation;
        let projectionMatrixLocation = material.projectionMatrixLocation;
        this.gl.useProgram(material.program); // bindeo los shaders        
        this.gl.uniformMatrix4fv(viewMatrixLocation, false, this.viewMatrix); // seteo la matriz de vista
        this.gl.uniformMatrix4fv(projectionMatrixLocation, false, this.projectionMatrix); // setep la matriz de proyeccion        
        this.gl.uniformMatrix4fv(modelMatrixLocation, false, localMatrix); // le seteo mi matrix al uniform
        this.gl.uniformMatrix4fv(normalMatrixLocation, false, normalMatrix); // le seteo mi matrix al uniform


        for ( let i = 0 ; i< material.uniforms.length ; ++i)
        {
            let uniformData = material.uniforms[i];
            /* usar el coso */
            this.gl.uniform3fv(uniformData.location, uniformData.value);
        }

       


        this.gl.bindVertexArray(vao); // bindeo su vao        
        this.gl.drawElements(renderMode, count, this.gl.UNSIGNED_SHORT, 0); // dibujo mi vao
        this.gl.bindVertexArray(null);

    }
}