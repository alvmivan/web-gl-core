import { Camera } from "../Camera.js";
import { initializeTransform }  from "./TransformFactory.js";


const defaultFar = 10000;
const defaultNear = 0.1;
const defaultFOV = 60;


/**
 * @param {import("../../../datamodel/Prefabs.js").CameraModel} cameraModel
 * @param {number} camera
 */
export function createCamera(cameraModel, aspect)
{
    let camera = new Camera(aspect);
    initializeTransform(camera.transform, cameraModel.transform);

    // me tomo la libertad de acceder a los privates porque se que luego llamo a recalculate Projetion
    
    camera._fov = cameraModel.fov;
    camera._far = cameraModel.far;
    camera._near = cameraModel.near;
    if(!camera._far)
    {
        camera._far = defaultFar;
    }
    if(!camera._fov)
    {
        camera._fov = defaultFOV;
    }
    if(!camera._near)
    {
        camera._near = defaultNear;
    }
    camera.recalculateProjection();   
}

export function createDefaultCamera(aspect)
{
    let camera = new Camera(aspect);
    camera._far = defaultFar;
    camera._fov = defaultFOV;
    camera._near = defaultNear;
    camera.recalculateProjection(); 
    return camera;
}