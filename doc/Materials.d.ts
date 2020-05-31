interface BaseMaterialModel
{
    /**
     * Nombre del material, se puede usar como una key para obtener el template del material
     */
    name : string;
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
     */
    normalName: string;
}

