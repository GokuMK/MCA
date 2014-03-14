function Mob(p, r, u){
    this.pos = p || [0,0,0];
    this.rot = r || [0,0];
    this.up = u || [0,1,0];
    this.eyePos = [0,0,0];
    this.przesx = 0;
    this.przesy = 0; 
    this.przesz = 0;
}

Mob.prototype.getEye = function(){
    return [this.pos[0] + this.eyePos[0], this.pos[1] + this.eyePos[1], this.pos[2] + this.eyePos[2]];
};

Mob.prototype.getPos = function(){
    return this.pos;
};

Mob.prototype.getTarget = function(){
    return [this.pos[0] + this.eyePos[0] + Math.sin(this.rot[0]) * Math.cos(this.rot[1]), 
        this.pos[1] + this.eyePos[1] + Math.sin(this.rot[1]) * 1, 
        this.pos[2] + this.eyePos[2] + Math.cos(this.rot[0]) * Math.cos(this.rot[1]) ];
};

Mob.prototype.render = function(){
        var shader = gluu.lineShader;

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
            gl.bufferData(gl.ARRAY_BUFFER, this.shape, gl.STATIC_DRAW);
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.shapeVbo);
            gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 5*4, 0 );
            gl.vertexAttribPointer(shader.lightAttribute, 4, gl.FLOAT, false, 5*4, 0 );
            gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 5*4, 3*4 );
            gl.drawArrays(gl.TRIANGLES, 0, 36);
        }
    };