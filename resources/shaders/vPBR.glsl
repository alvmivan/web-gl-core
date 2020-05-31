#version 300 es
precision mediump float;

uniform mat4 modelMatrix;
uniform mat4 normalMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;



in vec3 vertexPosition;
in vec3 normal;

out vec3 vertNormal;


void main() 
{   
    vertNormal = (normalMatrix * vec4(normal,1)).xyz;
    
    gl_Position = projectionMatrix * viewMatrix *  modelMatrix * vec4(vertexPosition, 1);
}
    