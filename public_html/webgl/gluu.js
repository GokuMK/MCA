function Gluu () {
    this.standardShader = null;
    this.lineShader = null;
    this.selectionShader = null;
    this.mvMatrix = mat4.create();
    this.objStrMatrix = mat4.create([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
    this.mvMatrixStack = [];
    this.pMatrix = mat4.create();
} 
    Gluu.prototype.initGL = function(canvas) {
        try {
            //gl = canvas.getContext("experimental-webgl");
            gl = canvas.getContext("experimental-webgl", { antialias: false, alpha: false });
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL");
        }
    };

    Gluu.prototype.getShader = function(gl, name, type) {
        var xmlHttp = new XMLHttpRequest();
        
        if(window['shadersCode'] !== undefined){
            var shaderScript = shadersCode[type][name];
            if (shaderScript === undefined) {
                return null;
            }
        } else {
            xmlHttp.open( "GET", "shaders/"+name+"."+type, false );
            xmlHttp.send( null );
            var shaderScript = xmlHttp.responseText;
            if (!shaderScript) {
                return null;
            }
        }
        var shader;
        if (type === "fs") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (type === "vs") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, shaderScript);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    };
    
    Gluu.prototype.initLineShader = function() {
        var fragmentShader = this.getShader(gl, "line","fs");
        var vertexShader = this.getShader(gl, "line","vs");

        this.lineShader = gl.createProgram();
        gl.attachShader(this.lineShader, vertexShader);
        gl.attachShader(this.lineShader, fragmentShader);
        gl.linkProgram(this.lineShader);

        if (!gl.getProgramParameter(this.lineShader, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(this.lineShader);

        this.lineShader.vertexPositionAttribute = gl.getAttribLocation(this.lineShader, "aVertexPosition");
        gl.enableVertexAttribArray(this.lineShader.vertexPositionAttribute);

        this.lineShader.textureCoordAttribute = gl.getAttribLocation(this.lineShader, "aTextureCoord");
        gl.enableVertexAttribArray(this.lineShader.textureCoordAttribute);
        this.lineShader.lightAttribute = gl.getAttribLocation(this.lineShader, "lightValue");
        gl.enableVertexAttribArray(this.lineShader.lightAttribute);

        this.lineShader.pMatrixUniform = gl.getUniformLocation(this.lineShader, "uPMatrix");
        this.lineShader.mvMatrixUniform = gl.getUniformLocation(this.lineShader, "uMVMatrix");
        //this.chunkSelectionShader.msMatrixUniform = gl.getUniformLocation(this.lineShader, "uMSMatrix");
        //this.chunkSelectionShader.samplerUniform = gl.getUniformLocation(this.lineShader, "uSampler");
    };
    
    Gluu.prototype.initSelectionShader = function() {
        var fragmentShader = this.getShader(gl, "selection","fs");
        var vertexShader = this.getShader(gl, "selection","vs");

        this.selectionShader = gl.createProgram();
        gl.attachShader(this.selectionShader, vertexShader);
        gl.attachShader(this.selectionShader, fragmentShader);
        gl.linkProgram(this.selectionShader);

        if (!gl.getProgramParameter(this.selectionShader, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(this.selectionShader);

        this.selectionShader.vertexPositionAttribute = gl.getAttribLocation(this.selectionShader, "aVertexPosition");
        gl.enableVertexAttribArray(this.selectionShader.vertexPositionAttribute);

        this.selectionShader.textureCoordAttribute = gl.getAttribLocation(this.selectionShader, "aTextureCoord");
        gl.enableVertexAttribArray(this.selectionShader.textureCoordAttribute);
        this.selectionShader.lightAttribute = gl.getAttribLocation(this.selectionShader, "lightValue");
        gl.enableVertexAttribArray(this.selectionShader.lightAttribute);

        this.selectionShader.pMatrixUniform = gl.getUniformLocation(this.selectionShader, "uPMatrix");
        this.selectionShader.mvMatrixUniform = gl.getUniformLocation(this.selectionShader, "uMVMatrix");
        this.selectionShader.msMatrixUniform = gl.getUniformLocation(this.selectionShader, "uMSMatrix");
        this.selectionShader.samplerUniform = gl.getUniformLocation(this.selectionShader, "uSampler");
    };
    
    Gluu.prototype.initStandardShader = function() {
        var fragmentShader = this.getShader(gl, settings.worldShader,"fs");
        var vertexShader = this.getShader(gl, settings.worldShader,"vs");
        
        this.standardShader = gl.createProgram();
        gl.attachShader(this.standardShader, vertexShader);
        gl.attachShader(this.standardShader, fragmentShader);
        gl.linkProgram(this.standardShader);

        if (!gl.getProgramParameter(this.standardShader, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(this.standardShader);

        this.standardShader.vertexPositionAttribute = gl.getAttribLocation(this.standardShader, "aVertexPosition");
        gl.enableVertexAttribArray(this.standardShader.vertexPositionAttribute);

        this.standardShader.textureCoordAttribute = gl.getAttribLocation(this.standardShader, "aTextureCoord");
        gl.enableVertexAttribArray(this.standardShader.textureCoordAttribute);
        this.standardShader.lightAttribute = gl.getAttribLocation(this.standardShader, "lightValue");
        gl.enableVertexAttribArray(this.standardShader.lightAttribute);
        
        this.standardShader.lod = gl.getUniformLocation(this.standardShader, "lod");
        this.standardShader.sun = gl.getUniformLocation(this.standardShader, "sun");
        this.standardShader.brightness = gl.getUniformLocation(this.standardShader, "brightness");
        this.standardShader.skyColor = gl.getUniformLocation(this.standardShader, "skyColor");
        this.standardShader.pMatrixUniform = gl.getUniformLocation(this.standardShader, "uPMatrix");
        this.standardShader.mvMatrixUniform = gl.getUniformLocation(this.standardShader, "uMVMatrix");
        this.standardShader.msMatrixUniform = gl.getUniformLocation(this.standardShader, "uMSMatrix");
        this.standardShader.samplerUniform = gl.getUniformLocation(this.standardShader, "uSampler");
    };
    
    Gluu.prototype.setMatrixUniforms = function() {
        gl.uniformMatrix4fv(this.standardShader.pMatrixUniform, false, this.pMatrix);
        gl.uniformMatrix4fv(this.standardShader.mvMatrixUniform, false, this.mvMatrix);
        gl.uniformMatrix4fv(this.standardShader.msMatrixUniform, false, this.objStrMatrix);
    };

    Gluu.prototype.mvPushMatrix = function() {
        var copy = mat4.clone(this.mvMatrix);
        this.mvMatrixStack.push(copy);
    };

    Gluu.prototype.mvPopMatrix = function() {
        if (this.mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        this.mvMatrix = this.mvMatrixStack.pop();
    };
    
    Gluu.prototype.degToRad = function(degrees) {
        return degrees * Math.PI / 180;
    };