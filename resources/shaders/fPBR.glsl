#version 300 es
precision mediump float;

in vec3 vertNormal;
in vec3 viewDir;


out vec4 outColor;
uniform vec3 color;

void main() 
{       

    // hardcodeo direccion de la luz (la luz es blanca, ya fue)
    vec3 lightDir = normalize(vec3(0.2,1.0,1.0));


    //todo: calcular difuso
    
    vec3 difuso = color;



    // le hago un fresnel
    float fresnelEffect = max(dot(normalize(viewDir), vertNormal),0.01);
    difuso *= fresnelEffect;    
    

    outColor = vec4(difuso, 1); 
}

