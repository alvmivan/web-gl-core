import { quat, mat3 , glMatrix, vec3 } from "./gl-matrix/index.js";

export const X = 0;
export const Y = 1;
export const Z = 2;
export const W = 3;


let auxVector = [0,0,0]
let auxQuaternion = [0,0,0,1]


// multiplica el quaternio por (0,0,1) optimizado // TODO: testear que ande piola
export function forward(rotation, forward) 
{
    let rotx = rotation[X];
    let roty = rotation[Y];
    let rotz = rotation[Z];
    let rotw = rotation[W];

    let xx2 = rotx * rotx * 2;
    let yy2 = roty * roty * 2;
    let xz2 = rotx * rotz * 2;
    let yz2 = roty * rotz * 2;
    let wx2 = rotw * rotx * 2;
    let wy2 = rotw * roty * 2;
    
    forward[X] = (xz2 + wy2);
    forward[Y] = (yz2 - wx2); 
    forward[Z] = 1 - (xx2 + yy2);
}

// multiplica el quaternio por (1,0,0) optimizado
export function right(rotation, right)
{
    let rotx = rotation[X];
    let roty = rotation[Y];
    let rotz = rotation[Z];
    let rotw = rotation[W];

    let yy2 = roty * roty * 2;
    let zz2 = rotz * rotz * 2;
    let xy2 = rotx * roty * 2;
    let xz2 = rotx * rotz * 2;
    let wy2 = rotw * roty * 2;
    let wz2 = rotw * rotz * 2;

    right[X] = (1.0 - ( yy2 + zz2)) 
    right[Y] = ( xy2 +  wz2) 
    right[Z] = ( xz2 -  wy2) 
}

// multiplica un cuaternio por un vector (le aplica su rotacion) 
export function rotateVector(rotatedPoint, rotation, point)
{
    let rotx = rotation[X];
    let roty = rotation[Y];
    let rotz = rotation[Z];
    let rotw = rotation[W];

    let xx2 = rotx * rotx * 2;
    let yy2 = roty * roty * 2;
    let zz2 = rotz * rotz * 2;
    let xy2 = rotx * roty * 2;
    let xz2 = rotx * rotz * 2;
    let yz2 = roty * rotz * 2;
    let wx2 = rotw * rotx * 2;
    let wy2 = rotw * roty * 2;
    let wz2 = rotw * rotz * 2;
    
    let pointx = point[X];
    let pointy = point[Y];
    let pointz = point[Z];   

    rotatedPoint[X] = ((1.0 - ( yy2 + zz2)) *  pointx + ( xy2 -  wz2) *  pointy + (xz2 + wy2) *  pointz);
    rotatedPoint[Y] = (( xy2 +  wz2) *    pointx + (1.0 - (  xx2 +   zz2)) *    pointy + (  yz2 -   wx2) *   pointz); 
    rotatedPoint[Z] = (( xz2 -  wy2) *    pointx + (  yz2 +   wx2) *    pointy + (1.0 - (  xx2 +   yy2)) *    pointz);
}

/**
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 */
export function clamp(value , min , max)
{
    return Math.min(max, Math.max(min, value));
}

/**
 * Esta funcion  hace que el Transform transform
 * rote al rededor de un eje una cierta cantidad de grados (en euler)
 * 
 * @param {{
 *          position:number[]
 *          rotation:number[]         
 *        }} transform 
 * @param {number[]} pivote 
 * @param {number} eulerAngle 
 * @param {number[]} axis 
 */
export function rotateTowards(transform, pivote, eulerAngle, axis, translate = true)
{
    // guardo la direccion del pivote al punto del transform
    auxVector[X] = transform.position[X] - pivote[X];
    auxVector[Y] = transform.position[Y] - pivote[Y];
    auxVector[Z] = transform.position[Z] - pivote[Z];

    // creo una rotacion con el axis y el angulo euler
    quat.fromEuler(auxQuaternion, eulerAngle * axis[X], eulerAngle * axis[Y], eulerAngle * axis[Z]);
    
    // roto la direccion del pivote al transform
    rotateVector(auxVector, auxQuaternion, auxVector);

    // roto tambien el quaternio del transform con esa misma rotacion 
    quat.mul(transform.rotation, transform.rotation, auxQuaternion);

    if(translate)
    {   
        // reubico el punto del transform usando la direccion ya rotada
        transform.position[X] = pivote[X] + auxVector[X];
        transform.position[Y] = pivote[Y] + auxVector[Y];
        transform.position[Z] = pivote[Z] + auxVector[Z];
    }

}


let auxMat3 = [1,0,0,0,1,0,0,0,1]

// son para mat3 estas constantes, en mat4 no sirven porque hay un desface para la W
const X0 = 0;
const Y0 = 1;
const Z0 = 2;
const X1 = 3;
const Y1 = 4;
const Z1 = 5;
const X2 = 6;
const Y2 = 7;
const Z2 = 8;

/**
 * 
 * @param {number[]} position 
 * @param {number[]} target 
 * @param {number[]} up 
 * @param {number[]} outRotation 
 */
export function setForward(position, target, up, outRotation) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    
  
    if (Math.abs(position[X] - target[X]) < glMatrix.EPSILON && Math.abs(position[Y] - target[Y]) < glMatrix.EPSILON && Math.abs(position[Z] - target[Z]) < glMatrix.EPSILON) 
    {
      console.log("return identity")
      quat.identity(outRotation);
    }
    
    z0 = position[X] - target[X];
    z1 = position[Y] - target[Y];
    z2 = position[Z] - target[Z];
    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = up[Y] * z2 - up[Z] * z1;
    x1 = up[Z] * z0 - up[X] * z2;
    x2 = up[X] * z1 - up[Y] * z0;
    len = Math.hypot(x0, x1, x2);
  
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
  
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.hypot(y0, y1, y2);
  
    if (!len)
    {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    }
    else
    {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
  
    auxMat3[X0] = x0;
    auxMat3[Y0] = y0;
    auxMat3[Z0] = z0;    
    auxMat3[X1] = x1;
    auxMat3[Y1] = y1;
    auxMat3[Z1] = z1;
    auxMat3[X2] = x2;
    auxMat3[Y2] = y2;
    auxMat3[Z2] = z2;

    quat.fromMat3(outRotation, auxMat3);   

  }


/**
 * 
 * @param {number[]} vertices 
 * @param {number[]} triangles 
 */
export function calculateNormals(vertices, triangles)
{    
    let normals = []    

    for(let i=0 ; i<vertices.length / 3.0 ; i++)
    {
        addNormalForIndex(vertices,triangles,normals,i);
    }
    
    return normals;
}

let vec = [0,0,0]
let incidencia1 = [0,0,0]
let incidencia2 = [0,0,0]

/**
 * 
 * @param {number[]} vertices 
 * @param {number[]} triangles 
 * @param {number[]} normalsList 
 * @param {number} index 
 */
function addNormalForIndex(vertices, triangles, normalsList, index)
{    
    let commonNormals = []
    let inc1Debug = []
    let inc2Debug = []
    for(let i=0 ; i<triangles.length ; i+=3)
    {
      let isTriangle = false;
      if(triangles[i] == index)
      {
        isTriangle = true;
        incidencia1[X] = vertices[index + X] - vertices[triangles[i+2] + X]
        incidencia1[Y] = vertices[index + Y] - vertices[triangles[i+2] + Y]
        incidencia1[Z] = vertices[index + Z] - vertices[triangles[i+2] + Z]

        incidencia2[X] = vertices[index + X] - vertices[triangles[i+1] + X]
        incidencia2[Y] = vertices[index + Y] - vertices[triangles[i+1] + Y]
        incidencia2[Z] = vertices[index + Z] - vertices[triangles[i+1] + Z]        
      }
      if(triangles[i+1] == index)
      {
        isTriangle = true;
        incidencia1[X] = vertices[index + X] - vertices[triangles[i] + X]
        incidencia1[Y] = vertices[index + Y] - vertices[triangles[i] + Y]
        incidencia1[Z] = vertices[index + Z] - vertices[triangles[i] + Z]    

        incidencia2[X] = vertices[index + X] - vertices[triangles[i+2] + X]
        incidencia2[Y] = vertices[index + Y] - vertices[triangles[i+2] + Y]
        incidencia2[Z] = vertices[index + Z] - vertices[triangles[i+2] + Z]  
      }
      if(triangles[i+2] == index)
      {
        isTriangle = true;
        incidencia1[X] = vertices[index + X] - vertices[triangles[i+1] + X]
        incidencia1[Y] = vertices[index + Y] - vertices[triangles[i+1] + Y]
        incidencia1[Z] = vertices[index + Z] - vertices[triangles[i+1] + Z]  

        incidencia2[X] = vertices[index + X] - vertices[triangles[i] + X]
        incidencia2[Y] = vertices[index + Y] - vertices[triangles[i] + Y]
        incidencia2[Z] = vertices[index + Z] - vertices[triangles[i] + Z]        
      }
      
      if(isTriangle)
      {
        vec3.cross(vec,incidencia1,incidencia2);
        vec3.normalize(vec,vec);                
        commonNormals.push([...vec])  
        inc1Debug.push([...incidencia1])      
        inc2Debug.push([...incidencia2])      
        //break;        
      }
    }
    vec[X]=0;
    vec[Y]=0;
    vec[Z]=0;
    if(commonNormals.length == 0)
    {
      console.log( " falla en el vertice con indice : "+index+ " no se encontro ningun triangulo asociado")
    }


    for( let i= 0 ; i< commonNormals.length ; i++)
    {
        vec[X] += commonNormals[i][X];
        vec[Y] += commonNormals[i][Y];
        vec[Z] += commonNormals[i][Z];
    }

    if(vec3.length(vec)<0.01)
    {
      console.log( " falla en el vertice con indice : "+index+ " da cero el producto usando "+incidencia1+" and "+incidencia2)
    }
   


    vec3.normalize(vec,vec);
    let ind = normalsList.length;
    console.log(` para el vertice : ${vertices[ind+X]}, ${vertices[ind+Y]}, ${vertices[ind+Z]} tengo de normal : ${vec[X]}, ${vec[Y]}, ${vec[Z]}` )


    normalsList.push(vec[X],vec[Y],vec[Z])
}



