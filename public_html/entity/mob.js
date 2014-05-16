function Mob(p, r, u){
    this.pos = p || [0,0,0];
    this.oldPos = [0,0,0];
    this.speed = [0,0,0];
    this.tPos = [0,0,0];
    this.rot = r || [0,0];
    this.up = u || [0,1,0];
    this.eyePos = [0,0,0];
    this.przesx = 0;
    this.przesy = 0; 
    this.przesz = 0;
    this.name = "";
    this.lastTime = lastTime;
}

Mob.prototype.setPos = function(x,y,z){
   this.pos[0] = x; this.pos[1] = y; this.pos[2] = z; 
};

Mob.prototype.setName = function(name){
    this.name = name;
    this.nameVbo = undefined;
};

/*Mob.prototype.getEye = function(){
    return [this.pos[0], this.pos[1] + this.eyePos[1], this.pos[2]];
};*/

Mob.prototype.getEye = function(){
    return [this.pos[0] + this.eyePos[0]*Math.cos(-this.rot[0]) - this.eyePos[2]*Math.sin(-this.rot[0]), 
        this.pos[1] + this.eyePos[1], 
        this.pos[2]  + this.eyePos[0]*Math.sin(-this.rot[0]) + this.eyePos[2]*Math.cos(-this.rot[0])];
};

Mob.prototype.getPos = function(){
    return this.pos;
};

Mob.prototype.getRot = function(){
    return this.rot;
};

Mob.prototype.setPosRotRawInt = function(p){
    if(p !== undefined){
        this.oldPos[0] = this.tPos[0];
        this.oldPos[1] = this.tPos[1];
        this.oldPos[2] = this.tPos[2];
        this.pos[0] = p[0]/100.0;
        this.pos[1] = p[1]/100.0;
        this.pos[2] = p[2]/100.0;    
        this.tPos[0] = this.pos[0];
        this.tPos[1] = this.pos[1];
        this.tPos[2] = this.pos[2];
        this.rot[0] = p[3]/100.0;
        this.rot[1] = p[4]/100.0;
        
        var time = p[5] - this.lastTime;
        if(time !== 0){
            //console.log(1000/time);
            //console.log(this.oldPos);
            //console.log(this.pos);
            this.speed[0] = (this.oldPos[0] - this.pos[0])*(1000/time)*0.5;
            this.speed[1] = (this.oldPos[1] - this.pos[1])*(1000/time)*0.5;
            this.speed[2] = (this.oldPos[2] - this.pos[2])*(1000/time)*0.5;
            //console.log(this.speed);
        }
        this.lastTime =  p[5];
    }
    //console.log(this.pos[0]+ " "+this.pos[1]+" "+this.pos[2]);
};

Mob.prototype.setPosRot = function(p, r){
    if(p !== undefined){
        this.pos[0] = p[0];
        this.pos[1] = p[1];
        this.pos[2] = p[2];    
    }
    if(r !== undefined){
        this.rot[0] = r[0];
        this.rot[1] = r[1];
        this.rot[2] = r[2];
    }
};

Mob.prototype.getTarget = function(){
    return [this.pos[0] + + this.eyePos[0]*Math.cos(-this.rot[0]) - this.eyePos[2]*Math.sin(-this.rot[0]) + Math.sin(this.rot[0]) * Math.cos(this.rot[1]), 
        this.pos[1] + this.eyePos[1] + Math.sin(this.rot[1]), 
        this.pos[2] + this.eyePos[0]*Math.sin(-this.rot[0]) + this.eyePos[2]*Math.cos(-this.rot[0]) + Math.cos(this.rot[0]) * Math.cos(this.rot[1]) ];
};
/*Mob.prototype.getTarget = function(){
    return [this.pos[0] + Math.sin(this.rot[0]) * Math.cos(this.rot[1]), 
        this.pos[1] + this.eyePos[1] + Math.sin(this.rot[1]), 
        this.pos[2] + Math.cos(this.rot[0]) * Math.cos(this.rot[1]) ];
};*/
Mob.prototype.update = function(fps){
        this.pos[0] -= this.speed[0]/fps;
        this.pos[2] -= this.speed[2]/fps;
};

Mob.prototype.render = function(){
        if(this.texture === undefined) return;
        if(!this.texture.loaded) return;
        
        var shader = gluu.standardShader;
        gl.useProgram(shader);
        
        mat4.identity(gluu.mvMatrix);
        mat4.translate(gluu.mvMatrix, gluu.mvMatrix, [this.pos[0], this.pos[1], this.pos[2]]);
        gl.uniformMatrix4fv(shader.pMatrixUniform, false, gluu.pMatrix);
        gl.uniformMatrix4fv(shader.mvMatrixUniform, false, gluu.mvMatrix);

        if(this.shape === undefined) {
            return;
        }
        if(this.shapeVbo === undefined) {
            this.shapeVbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.shapeVbo);
            gl.bufferData(gl.ARRAY_BUFFER, this.renderShape, gl.STATIC_DRAW);
        } else {
            gluu.mvPushMatrix();
            mat4.rotateY(gluu.mvMatrix, gluu.mvMatrix, this.rot[0]);
            gl.uniformMatrix4fv(shader.mvMatrixUniform, false, gluu.mvMatrix);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.shapeVbo);
            gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 9*4, 0 );
            gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 9*4, 3*4 );
            gl.vertexAttribPointer(shader.lightAttribute, 4, gl.FLOAT, false, 9*4, 5*4 );
            gl.drawArrays(gl.TRIANGLES, 0, this.renderShape.length/9);
            gluu.mvPopMatrix();
        }
        
        if(this.drawName === true){
            if(this.nameVbo === undefined) {
                this.nameVbo = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.nameVbo);
                gl.bufferData(gl.ARRAY_BUFFER, this.nameShape, gl.STATIC_DRAW);
                
                this.nameTexture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, this.nameTexture);

                var textureCanvas = document.getElementById('texture512x64');
                var ctx = textureCanvas.getContext('2d');
                ctx.clearRect (0, 0, textureCanvas.width, textureCanvas.height);
                ctx.fillStyle = "rgba(50, 50, 50, 0.6)";
                ctx.font = "60px Arial";
                var width = ctx.measureText(this.name).width;
                ctx.fillRect(textureCanvas.width/2 - width/2 - 10, 0, width + 20, textureCanvas.height);
                
                ctx.fillStyle = 'white';
                ctx.lineWidth = 3;
                ctx.fillText(this.name,textureCanvas.width/2 - width/2,64-10);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            } else {
                gl.bindTexture(gl.TEXTURE_2D, this.nameTexture);
                gluu.mvPushMatrix();
                var rot = camera.getRot();
                
                mat4.translate(gluu.mvMatrix, gluu.mvMatrix,[0.15*Math.sin(-this.rot[0]),0,-0.15*Math.cos(-this.rot[0])]);
                mat4.rotateY(gluu.mvMatrix, gluu.mvMatrix, rot[0]);
                gl.uniformMatrix4fv(shader.mvMatrixUniform, false, gluu.mvMatrix);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.nameVbo);
                gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 9*4, 0 );
                gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 9*4, 3*4 );
                gl.vertexAttribPointer(shader.lightAttribute, 4, gl.FLOAT, false, 9*4, 5*4 );
                gl.drawArrays(gl.TRIANGLES, 0, 6);

                gluu.mvPopMatrix();
            }
        }
    };