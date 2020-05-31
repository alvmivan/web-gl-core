import { Transform } from "../Transform";



/**
 * 
 * @param {Transform} transform 
 */
function identitizeTransformProperties(transform)
{
    if(!transform.position)
    {
        transform.position = [0,0,0]
    }    
    if(!transform.rotation)
    {
        transform.rotation = [0,0,0,1]
    }
    if(!transform.scale)
    {
        transform.scale = [1,1,1]
    }
}


/**
 * 
 * @param {Transform} transform 
 * @param {import("../../../datamodel/Prefabs").TransformModel} transformModel 
 */
export function initializeTransform(transform, transformModel)
{   
    if(transformModel)
    {
        transform.position = transformModel.position;
        transform.rotation = transformModel.rotation;
        transform.scale = transformModel.scale;
    }
    identitizeTransformProperties(transform);
}