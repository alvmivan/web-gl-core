/**
 * define la estructura del json de un .material
 */
interface BaseMaterialModel
{
    /**
     * Nombre del material, se puede usar como una key para obtener el template del material
     * tiene que matchear (ignore case) con el nombre del archivo (sin la extension)
     * @default nombre del archivo sin el ".material" 
     */
    name : string | undefined;
    /**
     * el path al fragment shader
     * @example "shaders/myAwesomeFragmentShader.glsl"
     */
    fragmentPath: string;
    /**
     * el path al vertex shader
     * @example "shaders/myCuteVertexShader.glsl"
     */
    vertexPath: string;
    /**
     * el nombre del uniform de la model matrix en el shader
     * @example "modelMatrix"
     */
    modelMatrixName: string;
    /**
     * el nombre del uniform de la viewMatrix del shader
     * @example "viewMatrix"
     */
    viewMatrixName: string;
    /**
     * el nombre del uniform de la projection matrix del shader
     * @example "projectionMatrix"
     */
    projectionMatrixName: string;
    /**
    * el nombre del attribute de la vertexposition en el shader
    * @example "position"
    */
    vertexPositionName: string;
    /**
     * el nombre del uniform de la model matrix en el shader
     * @example "normalMatrix"
     */
    normalMatrixName: string;
    /**
     * el normbre del attribute de la vertexnormal en el shader
     * @example "normal"
     */
    normalName: string;
}

