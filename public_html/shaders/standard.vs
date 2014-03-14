attribute vec3 aVertexPosition;
attribute vec4 lightValue;
attribute vec2 aTextureCoord;

uniform float lod;
uniform mat4 uMVMatrix;
uniform mat4 uMSMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;
varying float aaa;
varying vec4 color;
varying float slight;

void main(void) {
     gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
     vTextureCoord = aTextureCoord;
    //if(gl_Position.z < 0) return;
    aaa = sqrt((gl_Position.x)*(gl_Position.x) + (gl_Position.z)*(gl_Position.z))/(lod*14.5)-0.25;
    if(aaa<0.0) aaa = 0.0;
    float skylight = floor(lightValue.x/100.0);
    float blocklight = lightValue.x - skylight*100.0;
    slight = (skylight/15.0 + blocklight/15.0);//*lightValue.z;
    if(slight > 1.0) slight = 1.0;
    slight = slight*0.85 + 0.15;
    slight *= lightValue.z;
    if(lightValue.a != 0.0) {
        float m5 = floor(lightValue.a/(256.0*256.0));
        float m6 = floor((lightValue.a - m5*256.0*256.0)/(256.0));
        float m7 = lightValue.a - m5*256.0*256.0 - m6*256.0;

        //writeln("m = "+ m5/255 +" "+m6+" "+m7
        //color = vec4(0.56,0.74,0.38,1.0);
        color = vec4(m5/255.0, m6/255.0, m7/255.0, 1.0);
    }
    else color = vec4(1.0,1.0,1.0,1.0);
    //slight += lightValue.z;
}
