function Pointer(){

}

Pointer.prototype.render = function(){
        var shader = gluu.lineShader;
        gl.useProgram(shader);
        mat4.identity(gluu.mvMatrix);
        mat4.identity(gluu.pMatrix);
        gl.uniformMatrix4fv(shader.pMatrixUniform, false, gluu.pMatrix);
        gl.uniformMatrix4fv(shader.mvMatrixUniform, false, gluu.mvMatrix);
        
        if(this.vbol === undefined) {
            this.vbol = gl.createBuffer();
            var vtx = new Float32Array(
                [-0.03, 0.0, 0.0, 0.0, 0.0,
                0.03, 0.0, 0.0, 0.0, 0.0,
                0.0, -0.05, 0.0, 0.0, 0.0,
                0.0, 0.05, 0.0, 0.0, 0.0]
            );
            this.vbol = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbol);
            gl.bufferData(gl.ARRAY_BUFFER, vtx, gl.STATIC_DRAW);
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbol);
            gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 5*4, 0 );
            gl.vertexAttribPointer(shader.lightAttribute, 4, gl.FLOAT, false, 5*4, 0 );
            gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 5*4, 3*4 );
            gl.drawArrays(gl.LINES, 0, 4);
        }
    };