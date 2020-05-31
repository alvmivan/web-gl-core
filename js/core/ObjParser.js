import {TrianglesMeshModel} from "./TrianglesMeshModel.js"


export class ObjParser
{
    /**
     * @returns {TrianglesMeshModel}
     * @param {String} objRaw 
     */
    parse(objRaw)
    {
        if(typeof objRaw !== 'string')
        {
            objRaw = objRaw.toString();
        }

        var lines = objRaw.trim().split('\n');

        var positions = [];
        var cells = [];
        var vertexUVs = [];
        var vertexNormals = [];
        var faceUVs = [];
        var faceNormals = [];
        var name = null;

        for(var i=0; i<lines.length; i++) {
          var line = lines[i];
    
          if(line[0] === '#') continue; // ignorar los comentarios
    
          var parts = line.trim().replace(/ +/g, ' ').split(' ');
    
          switch(parts[0]) 
          {
            case 'o':
              name = parts.slice(1).join(' ');
              break;
            case 'v':
              var position = parts.slice(1).map(Number).slice(0, 3);
              positions = combine(positions, position);
              break;
            case 'vt':
              var uv = parts.slice(1).map(Number);
              vertexUVs = combine(vertexUVs, uv);
              break;
            case 'vn':
              var normal = parts.slice(1).map(Number).slice(0, 3);
              vertexNormals = combine(vertexNormals, normal);
              break;
            case 'f':
              var positionIndices = [];
              var uvIndices = [];
              var normalIndices = [];
          
              parts
                .slice(1)
                .forEach(function(part) {
                  var indices = part
                    .split('/')
                    .map(function(index) {
                      if(index === '') {
                        return NaN;
                      }
                      return Number(index);
                    })
                
                positionIndices.push(convertIndex(indices[0], positions.length));
                
                if(indices.length > 1) 
                {
                    if(!isNaN(indices[1])) {
                      uvIndices.push(convertIndex(indices[1], vertexUVs.length));
                    }
                    if(!isNaN(indices[2])) {
                      faceNormals.push(convertIndex(indices[2], vertexNormals.length));
                    }
                  }
              
                });
            
                cells = combine(cells, positionIndices);
            
                if(uvIndices.length > 0) 
                {
                  faceUVs.push(uvIndices); // todo: usar combine cuando lo necesitemos
                }
                if(normalIndices.length > 0) 
                {
                 // faceNormals = combine(faceNormals, normalIndices);                  
                }

              break;
            default:
              // skip
          }
    
        }
      
        var mesh = 
        {
            positions: positions,
            cells: cells
        };
      
        if(vertexUVs.length > 0) 
        {
          mesh.vertexUVs = vertexUVs;
        }
      
        if(faceUVs.length > 0) 
        { 
          mesh.faceUVs = faceUVs;
        }
      
        if(vertexNormals.length > 0) 
        {
          mesh.vertexNormals = vertexNormals;
        }
      
        if(faceNormals.length > 0) 
        {
          mesh.faceNormals = faceNormals;
        }
      
        if(name !== null) 
        {
          mesh.name = name;
        }

        let data = parseGeometryData(objRaw);

        let model = new TrianglesMeshModel();
        model.vertices = data.vertexPositions
        model.triangles = data.indexTriangles;
        model.meshName = mesh.name;
        model.normals = data.vertexNormals;
        //model.faceNormals = mesh.faceNormals;
        return model;
    }
} 
       
function convertIndex(objIndex, arrayLength) {
  return objIndex > 0 ? objIndex - 1 : objIndex + arrayLength;
}

function combine(listA, listB)
{
    return [...listA, ...listB];
}




/**
 * @param {string} path
 * @returns {string}
 */
export async function getFileContentsAsText(path) {
  const response = await fetch(path)
  const text = await response.text()

  return text
}

/**
 * @param {string} objData
 * @returns {GeometryData}
 */
export function parseGeometryData(objData) {
  //const objData = await getFileContentsAsText(objFilePath)

  // Pasamos las posiciones de los vertices, normales, caras, etc a arreglos

  const vertexPositions = [] // elementos "v": [[x, y, z], [x, y, z], ...]
  const vertexNormals = [] // elementos "vn": [[x, y, z], [x, y, z], ...]

  const vertices = [] // info de cada vértice: "2/9/1 1/7/3 ..." -> [[1, 8, 0], [0, 6, 2], ...]
  const verticesIndexMap = new Map() // mapeo de grupos "v/vt/vn" a su indice en el arreglo de vertices (para acceso rápido)
  const faces = [] // indices de los vertices que forman cada cara

  const lines = objData.split('\n')

  for (const line of lines) {
    const lineElements = line.split(' ') // "v 1.00 2.00 3.00" -> ["v", "1.00", "2.00", "3.00"]
    const firstElement = lineElements.shift() // ["v", "1.00", "2.00", "3.00"] -> ["1.00", "1.00", "1.00"]

    switch (firstElement) {
      case 'v':
        vertexPositions.push(lineElements.map((element) => parseFloat(element)))
        break
      case 'vn':
        vertexNormals.push(lineElements.map((element) => parseFloat(element)))
        break
      case 'f':
        const faceVertices = []

        for (const vertexString of lineElements) {
          let vertexIndex = verticesIndexMap.get(vertexString)

          if (vertexIndex === undefined) {
            const vertex = vertexString.split('/').map((element) => parseInt(element) - 1)
            vertices.push(vertex)
            vertexIndex = vertices.length - 1
            verticesIndexMap.set(vertexString, vertexIndex)
          }

          faceVertices.push(vertexIndex)
        }

        faces.push(faceVertices)
        break
    }
  }

  // Pasamos la información obtenida a un formato apropiado para uso en buffers (flattened: [x, y, z, x, y, z, x, ...])

  const flatVertexPositions = []

  for (const vertex of vertices) {
    const vertexPositionIndex = vertex[0]
    flatVertexPositions.push(...vertexPositions[vertexPositionIndex])
  }

  let flatVertexNormals = null

  if (vertexNormals.length > 0) {
    flatVertexNormals = []
    for (const vertex of vertices) {
      const vertexNormalIndex = vertex[2]
      flatVertexNormals.push(...vertexNormals[vertexNormalIndex])
    }
  }

  // Generamos el arreglo de indices para dibujado con triángulos (gl.TRIANGLES)

  const indexTriangles = faces.flat() // [[0, 1, 2], [4, 5, 6], ...] -> [0, 1, 2, 4, 5, 6, ...]

  // Generamos el arreglo de indices para dibujado con lineas (gl.LINES)

  const indexLines = []
  const alreadyAddedLines = new Set()

  for (const faceVertices of faces) {
    for (let index = 0; index < 3; index++) {
      // agarramos de a dos indices (i.e. los extremos de cada linea)
      const a = faceVertices[index]
      const b = faceVertices[(index + 1) % 3]

      // chequeamos que el par no haya sido ya agregado (a fin de evitar re-dibujar lineas)
      // y lo agregamos al indice
      if (!alreadyAddedLines.has(a + '/' + b) && !alreadyAddedLines.has(b + '/' + a)) {
        indexLines.push(a)
        indexLines.push(b)
        alreadyAddedLines.add(a + '/' + b)
      }
    }
  }

  return {
    vertexPositions: flatVertexPositions,
    vertexNormals: flatVertexNormals,
    indexTriangles,
    indexLines,
  }
}

// Definición de tipos

/**
 * @typedef {Object} GeometryData
 * @property {number[]} vertexPositions
 * @property {number[] | null} vertexNormals
 * @property {number[]} indexTriangles
 * @property {number[]} indexLines
 */