import { EngineDirector } from "./core/EngineDirector.js";

import {getCanvas, getRenderingContext} from "./utils.js";

const CANVASID = 'myCanvas';
let canvas = getCanvas(CANVASID);

/** @type {WebGL2RenderingContext}*/
let gl = getRenderingContext(canvas);


let engine = new EngineDirector();


engine.initialize(gl);

