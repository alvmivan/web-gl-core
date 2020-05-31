import {createIndexBuffer, bindAttributeToVertexBuffer, createProgram, createVertexBuffer } from "../utils.js";
import {TrianglesMeshModel} from "./TrianglesMeshModel.js"
import {Material} from "./Material.js"
import { calculateNormals } from "../maths.js";

/**
 * esta clase es la encargada de renderizar las meshes usando triangulos
 * tambien de la inicializacion del vao
 */


export class MeshRenderer
{    
    vao;    
    /** @type {Material} */
    material;
    count;
    renderMode;
    /**     
     * @param {Material} material
     * @param {TrianglesMeshModel} meshModel      
     * @param {WebGL2RenderingContext} gl     
     */
    constructor(meshModel, gl, material)
    {                


        console.log(meshModel);

        this.vao = gl.createVertexArray();        
        this.material = material;        
        this.count = meshModel.triangles.length;
        this.renderMode = gl.TRIANGLES;

        // meshModel.normals = calculateNormals(meshModel.vertices, meshModel.triangles);

        


        /// para test start

      //  let testear = true;


      //  if(testear)
      //  {
      //      meshModel.faceNormals = [0,0,0] // siempre el mismo indice
      //      meshModel.normals = [0,1,0] // up
      //  }
        

        /// para test end




        const positionBuffer = createVertexBuffer(gl, meshModel.vertices);
        const normalBuffer = createVertexBuffer(gl, meshModel.normals);

        const indexBuffer = createIndexBuffer(gl, meshModel.triangles);
        //const normalIndexBuffer = createIndexBuffer(gl, meshModel.faceNormals);
        

        

        gl.useProgram(material.program);
        gl.bindVertexArray(this.vao);        

        gl.enableVertexAttribArray(material.vertexPositionLocation);
        bindAttributeToVertexBuffer(gl, material.vertexPositionLocation, 3, positionBuffer);        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        if(meshModel.normals)
        {        
            gl.enableVertexAttribArray(material.normalLocation);
            bindAttributeToVertexBuffer(gl, material.normalLocation, 3, normalBuffer);        
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        }

        gl.bindVertexArray(null);
    }

    
}


