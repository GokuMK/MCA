function SelectionBox(){

}

SelectionBox.prototype.render = function(selection){
        if(selection === undefined) return;
        var shader = gluu.lineShader;
        gl.useProgram(shader);
        mat4.perspective(gluu.pMatrix, camera.fovy, gl.viewportWidth / gl.viewportHeight, 0.1, 6000.0);
        var lookAt = camera.getMatrix();
        mat4.multiply(gluu.pMatrix, gluu.pMatrix, lookAt);
        mat4.identity(gluu.mvMatrix);
        mat4.translate(gluu.mvMatrix, gluu.mvMatrix, [selection.chx*16+selection.x, selection.y, selection.chz*16+selection.z]);
        gl.uniformMatrix4fv(shader.pMatrixUniform, false, gluu.pMatrix);
        gl.uniformMatrix4fv(shader.mvMatrixUniform, false, gluu.mvMatrix);
        if(this.vboBox === undefined) {
            var vtx = new Float32Array(
	                [0.0, 0.0, 0.0, 0.0, 0.0,
	                0.0, 1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 0.0, 0.0,
	                1.0, 1.0, 0.0, 0.0, 0.0,
                        1.0, 1.0, 0.0, 0.0, 0.0,
	                1.0, 0.0, 0.0, 0.0, 0.0,
                        1.0, 0.0, 0.0, 0.0, 0.0,
	                0.0, 0.0, 0.0, 0.0, 0.0,
                        
                        0.0, 0.0, 1.0, 0.0, 0.0,
	                0.0, 1.0, 1.0, 0.0, 0.0,
                        0.0, 1.0, 1.0, 0.0, 0.0,
	                1.0, 1.0, 1.0, 0.0, 0.0,
                        1.0, 1.0, 1.0, 0.0, 0.0,
	                1.0, 0.0, 1.0, 0.0, 0.0,
                        1.0, 0.0, 1.0, 0.0, 0.0,
	                0.0, 0.0, 1.0, 0.0, 0.0,
                    
                        0.0, 0.0, 1.0, 0.0, 0.0,
	                0.0, 0.0, 0.0, 0.0, 0.0,
                        1.0, 1.0, 1.0, 0.0, 0.0,
	                1.0, 1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 1.0, 0.0, 0.0,
	                0.0, 1.0, 0.0, 0.0, 0.0,
                        1.0, 0.0, 1.0, 0.0, 0.0,
	                1.0, 0.0, 0.0, 0.0, 0.0]);
            this.vboBox = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vboBox);
            gl.bufferData(gl.ARRAY_BUFFER, vtx, gl.STATIC_DRAW);
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vboBox);
            gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 5*4, 0 );
            gl.vertexAttribPointer(shader.lightAttribute, 4, gl.FLOAT, false, 5*4, 0 );
            gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 5*4, 3*4 );
            gl.drawArrays(gl.LINES, 0, 24);
        }
    };