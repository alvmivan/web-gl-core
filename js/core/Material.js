/**
 * aca se guardan los datos adicionales al program
 */
export class Material 
{
    program;

    //uniforms
    modelMatrixLocation;
    viewMatrixLocation;
    projectionMatrixLocation;
    normalMatrixLocation;
    
    //attributes    
    normalLocation;
    vertexPositionLocation;

    clone()
    {
        return {... this}
    }
    

}
