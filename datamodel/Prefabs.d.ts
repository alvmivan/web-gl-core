/**
 * define la estructura del json de un *.prefab
 */
interface PrefabModule
{
    entities : GameEntityModel[]    
    lights : BaseLightModel[]
    camera : CameraModel[]
}

/**
 * tipo base para las entidades del juego (como luces, la camara, los objetos)
 */
interface BaseEntityModel
{
    /**
     * @default transform identidad
     */
    transform : TransformModel | undefined
}

interface CameraModel extends BaseEntityModel
{
    
}

interface BaseLightModel extends BaseEntityModel
{   
    /**
     * el tipo de la luz
     * Las directional y spot usan el forward de la rotacion del transform para su direccion
     * para poder manipularlas mejor
     * @example "directional" | "point" | "spot"
     */ 
    type : string ;
}

interface SpotLightModel extends BaseLightModel
{
    angle : number;
    maxDistance : number;
}

interface GameEntityModel extends BaseEntityModel
{
    /**
     * numero de la layer del objeto
     * @default 0
     */
    layer : number;

    /**
     * nombre del objeto
     */
    name: string;    
    /**
     * el path al archivo obj
     * @example "objs/myAwesomeObject.obj"
     */
    geometry: string;
    
    /**
     * @default []
     */
    scripts: ScriptModel[] | undefined;

    /**
     * @default { name : "default" } 
     * <todo: hay que definir|crear un material default>
     * 
     */
    material : MaterialInfo | undefined
}

interface MaterialInfo
{
    /**
     * nombre del material (tiene que corresponderse (ignoreCase) con un archivo .material listado en Materials)
     */
    name : string

    /**
     * una coleccion de uniforms del material
     */
    uniforms : UniformSet | undefined

}

/**
 * abstrae el conjunto de uniforms
 * al abstraer de una lista, podemos 
 * mas adelante declarar un tipo estandard de material
 * como PBR o Unlit
 */
interface UniformSet
{
    uniforms : UniformInfo[]
}

interface UniformInfo
{
    /**
     * el nombre del uniform en el shader
     * @example "color"
     */
    uniformName : string
    /**
     * el valor inicial para el uniform
     */
    initialValue : number[]

    /**
     * esto aun hay que definirlo bien
     * de momento, vamos a tener solo 
     * la cantidad de elementos del vector
     * para, al cargar el uniform usemos
     * gl["uniform"+uniformType+"fv"](location, value)
     * 
     * de momento solo son vectores de float lo que podemos llegar a necesitar
     * 
     * TODO: discutir un modo mas prolijo de manejar esto
     * 
     */
    uniformType : string | number
}



interface ScriptModel 
{
    /**
     * la key para encontrar el script
     */
    key: string;
    params: any | undefined; // opcional
}


interface TransformModel
{
    /**
     * @default [0,0,0]
     */
    position: number[] | undefined;
    /**
     * @default [0,0,0,1]
     */
    rotation: number[] | undefined;
    /**
     * @default [1,1,1]
     */
    scale: number[] | undefined;
}


/* 
Aclaraciones


    transform identidad es     
    {
        "position":[0,0,0] ,
        "rotation": [0,0,0,1] ,
        "scale":[1,1,1] 
    }
 */