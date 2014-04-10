precision mediump float;

varying vec2 vTextureCoord;
varying float aaa;
varying vec4 sLight;
varying vec4 color;
varying vec3 sky;

uniform vec4 skyColor;
uniform sampler2D uSampler;
            
void main(void) {

    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    if(gl_FragColor.a < 0.3)
       discard;    
    gl_FragColor *= color;
    //gl_FragColor.r = 1.0;
    //gl_FragColor.r = gl_FragColor.r*0.8 + 0.1;
    //gl_FragColor.g = gl_FragColor.g*0.8 + 0.1;
    //gl_FragColor.b = gl_FragColor.b*0.8 + 0.1;
    //gl_FragColor.r = aaa/40.0+0.5;
    //gl_FragColor *= slight;
    gl_FragColor = gl_FragColor*sLight;// + aaa*1.1;
    //gl_FragColor.g = gl_FragColor.g*slight;// + aaa*1.0;
    //gl_FragColor.b = gl_FragColor.b*slight;// + aaa*0.9;
    //skyColor.a = 1.0;
    //vec4 aaaa = vec4(skyColor[0],skyColor[1],skyColor[2],1.0);
    gl_FragColor = mix(gl_FragColor, skyColor, aaa);
    //gl_FragColor.a = 1.0;
}