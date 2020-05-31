import { HandAnim } from "./HandsAnim.js";
import { OrbitalCam } from "./OrbitalCam.js";
import { Seek } from "./Seek.js";
import { Orbit } from "./Orbit.js";

let map = new Map();



function loadMap()
{
    map.set("handsanim", () => new HandAnim());
    map.set("orbitalcam", ()=> new OrbitalCam());
    map.set("seek", ()=> new Seek());
    map.set("orbitate", ()=> new Orbit());


}




loadMap();

/**
 * 
 * @param {String} key 
 */
export function getScript(key)
{
    return map.get(key.toLowerCase())();
}