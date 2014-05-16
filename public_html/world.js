function World(opt){
    if(opt.server!==undefined)
        this.worldData = new RegionSrv(opt.server);
    else
        this.worldData = new RegionLib(opt.gameRoot, opt.worldName);
}

World.prototype.connect = function(server, name){
    this.worldData.connect(server, name);
};

World.prototype.getChunkBlock = function(chx, chz, x, y, z){
    return this.worldData.getChunkBlock(chx, chz, x, y, z);
};

World.prototype.getBlock = function(x, y, z){
    return this.worldData.getBlock(x, y, z);
};

World.prototype.updateChunkBlock = function(chx, chz, x, y, z, b, d){
    this.worldData.updateChunkBlock(chx, chz, x, y, z, b, d);
};

World.prototype.updateBlock = function(x, y, z, b, d){
    this.worldData.updateBlock(x, y, z, b, d);
};

World.prototype.setBlock = function(x, y, z, b, d){
    this.worldData.setBlock(x, y, z, b, d);
};

World.prototype.changeChunkBlockAdd = function(chx, chz, x, y, z){
    this.worldData.changeChunkBlockAdd(chx, chz, x, y, z);
};

World.prototype.updateChunks = function(){
    this.worldData.updateChunks();
};

World.prototype.deleteBuffers = function(){
    this.worldData.deleteBuffers();
};

World.prototype.save = function(){
    this.worldData.save();
};
    
World.prototype.requestChunk = function(x, z, load){
    return this.worldData.requestChunk(x, z, load);
};

World.prototype.new100msec = function(){
    this.worldData.new100msec();
};

World.prototype.new50msec = function(){
    this.worldData.new50msec();
};

World.prototype.render = function(){
        if(!blockTexture.loaded) return;
        
        gl.bindTexture(gl.TEXTURE_2D, blockTexture);
        var shader = gluu.standardShader;
        gl.useProgram(shader);
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(settings.skyColor[0], settings.skyColor[1], settings.skyColor[2], 1);
        //gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        mat4.perspective(gluu.pMatrix, camera.fovy, gl.viewportWidth / gl.viewportHeight, 0.1, 6000.0);
        var lookAt = camera.getMatrix();
        mat4.identity(gluu.mvMatrix);
        //mat4.translate(gluu.mvMatrix, gluu.mvMatrix, [-camera.entity.eyePos[0],-camera.entity.eyePos[1],-camera.entity.eyePos[2]]);
        mat4.multiply(gluu.pMatrix, gluu.pMatrix, lookAt);
        //
        gl.uniformMatrix4fv(shader.pMatrixUniform, false, gluu.pMatrix);
        gl.uniformMatrix4fv(shader.mvMatrixUniform, false, gluu.mvMatrix);
        gl.uniform1f(shader.lod, settings.distanceLevel[1]);
        gl.uniform1f(shader.sun, settings.sun);
        gl.uniform1f(shader.brightness, settings.brightness);
        gl.uniform4fv(shader.skyColor, settings.skyColor);
        var lodx = 0, lodz = 0, lod = 0;
        //var dlod = [20,23,20];
        //var dlod = [10,10,10];
        var dlod = [settings.distanceLevel[0],settings.distanceLevel[1],settings.distanceLevel[2],settings.distanceLevel[2]];
        var pos = new Array();
        var xxx = 0;
        var zzz = 0;
        var i = 0;
        var level = 0;
        var chunk;
        var cameraPos = camera.getPos();
        for(var drawLevel = 0; drawLevel < 4; drawLevel++){
            var posxxx = Math.floor(cameraPos[0]/16);
            var poszzz = Math.floor(cameraPos[2]/16);
            //for(var xxx = posxxx - dlod[drawLevel]; xxx < posxxx + dlod[drawLevel]; xxx++)
            //  for(var zzz = poszzz - dlod[drawLevel]; zzz < poszzz + dlod[drawLevel]; zzz++){
            pos[0] = 0;
            pos[1] = 0;
            for(var lll = -1; lll < dlod[drawLevel]*dlod[drawLevel]*4; lll++){
                if(lll !== -1){
                    pos = spiralLoop(lll);
                }
                xxx = posxxx + pos[0];
                zzz = poszzz + pos[1];
                //i = xxx*10000+zzz;
                chunk = this.requestChunk(xxx, zzz, false);
                if(chunk === -1 || chunk === -2) {
                    continue;
                }

                lodx = cameraPos[0] - (xxx*16 + 8);
                lodz = cameraPos[2] - (zzz*16 + 8);
                lod = Math.sqrt( lodx*lodx + lodz*lodz);
                if(lod > dlod[drawLevel]*16) continue;
                if(lod > 4*16){
                    var aaa = camera.getTarget();
                    var v1 = [cameraPos[0] - (aaa[0]), cameraPos[2] - (aaa[2])];
                    var v2 = [-lodx, -lodz];
                    var iloczyn = v1[0]*v2[0] + v1[1]*v2[1];
                    var d1 = Math.sqrt(v1[0]*v1[0]+v1[1]*v1[1]);
                    var d2 = Math.sqrt(v2[0]*v2[0]+v2[1]*v2[1]);
                    var zz = iloczyn/(d1*d2);
                    if(zz>0) continue;

                    var ccos = Math.cos(camera.fovx/1.5) + zz;
                    var xxxx = Math.sqrt(2*d2*d2*(1-ccos));
                    if((ccos > 0) && (xxxx > 16)) continue;
                }
                
                if(chunk === undefined) {
                if(iLag > 1){
                    iLag -= 1;
                    this.worldData.requestChunk(xxx, zzz);
                    }
                    continue;
                }

                chunk.timestamp = lastTime;
                
                if(cameraPos[1] >= settings.waterlevel || lod < 10*16)
                    chunk.render(drawLevel, shader, 0);
                if(cameraPos[1] < settings.waterlevel && lod < 6*16)
                    chunk.render(drawLevel, shader, 1);
                else if(lod < 5*16)
                    chunk.render(drawLevel, shader, 1);
            }
        }
    };

World.prototype.renderSelection = function(){
        if(!blockTexture.loaded) return;
        
        var shader = gluu.selectionShader;
        gl.useProgram(shader);
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0.0, 0.0, 0.0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        mat4.perspective(gluu.pMatrix, camera.fovy, gl.viewportWidth / gl.viewportHeight, 0.1, 6000.0);
        var lookAt = camera.getMatrix();
        mat4.multiply(gluu.pMatrix, gluu.pMatrix, lookAt);
        mat4.identity(gluu.mvMatrix);
        
        gl.uniformMatrix4fv(shader.pMatrixUniform, false, gluu.pMatrix);
        gl.uniformMatrix4fv(shader.mvMatrixUniform, false, gluu.mvMatrix);

        var pos = new Array();
        var xxx = 0;
        var zzz = 0;
        var i = 0;
        var chunk;
        var cameraPos = camera.getPos();
        for(var drawLevel = 0; drawLevel < 4; drawLevel++){
            var posxxx = Math.floor(cameraPos[0]/16);
            var poszzz = Math.floor(cameraPos[2]/16);
            pos[0] = 0;
            pos[1] = 0;
            for(var lll = -1; lll < 24; lll++){
                if(lll !== -1){
                    pos = spiralLoop(lll);
                }
                xxx = posxxx + pos[0];
                zzz = poszzz + pos[1];
                //i = xxx*10000+zzz;
                chunk = this.requestChunk(xxx, zzz, false);
                if(chunk === -1 || chunk === -2) {
                    continue;
                }
                if(chunk === undefined) {
                    if(iLag > 1){
                        iLag -= 1;
                        this.worldData.requestChunk(xxx, zzz);
                    }
                    continue;
                }
                chunk.timestamp = lastTime;
                
                chunk.render(drawLevel, shader, 0);
                chunk.render(drawLevel, shader, 1);
            }
        }

        var frameBufferData = new Uint8Array(4);
        gl.readPixels(Math.floor(gl.viewportWidth/2), Math.floor(gl.viewportHeight/2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, frameBufferData);
        var colorIndex = 0;
        //console.log(" = "+frameBufferData[colorIndex+0]+" = "+frameBufferData[colorIndex+1]+" = "+frameBufferData[colorIndex+2]);
        
        var selection = new Object();
        selection.y = frameBufferData[colorIndex+0];
        selection.z = Math.floor(frameBufferData[colorIndex+1]/16);
        selection.x = frameBufferData[colorIndex+1] - selection.z*16;
            
        var cv = Math.floor(frameBufferData[colorIndex+2]/10);
        selection.side = frameBufferData[colorIndex+2] - cv*10;
        var chx = Math.floor(cv/5);
        var chz = cv - chx*5;
        //console.log("y: "+selection.y+" z: "+selection.z+" x: "+selection.x+" chx: "+chx+" chz: "+chz+" side: "+selection.side);

        var posxxx = Math.floor(cameraPos[0]/16);
        var poszzz = Math.floor(cameraPos[2]/16);
        var achx = posxxx % 5; if(achx < 0) achx += 5;
        var achz = poszzz % 5; if(achz < 0) achz += 5;
        //console.log(" achx: "+achx+" achz: "+achz);
        chx -= achx;
        chz -= achz;
        if(chx > 2) chx -= 5;
        if(chx < -2) chx += 5;
        if(chz > 2) chz -= 5;
        if(chz < -2) chz += 5;
        selection.chx = posxxx + chx;
        selection.chz = poszzz + chz;
        selection.rchx = chx;
        selection.rchz = chz;
        return selection;
    };

World.prototype.getNearestPosition = function(pos){
    return this.worldData.getNearestPosition(pos);
};

World.prototype.testCollisions = function(){
            var cameraPos = camera.getPos();
            var posxxx = Math.floor(cameraPos[0]/16);
            var poszzz = Math.floor(cameraPos[2]/16);
            var posx = 0;
            var posz = 0;
            var chunk;
            //var xxx = posxxx + posx;
            //var zzz = poszzz + posz;
            var ttak = 0;
            //var timeNow1 = new Date().getTime();
            for(var xxx = posxxx - 1; xxx < posxxx + 2; xxx++)
              for(var zzz = poszzz - 1; zzz < poszzz + 2; zzz++){
                if(xxx*16 - 2 < cameraPos[0] 
                && xxx*16 + 18 > cameraPos[0]
                && zzz*16 - 2 < cameraPos[2] 
                && zzz*16 + 18 > cameraPos[2]){ 
                
                    //var i = xxx*10000+zzz;
                    chunk = this.requestChunk(xxx, zzz, false);
                    //console.log(chunk);
                    if(chunk === -1 || chunk === -2 || chunk === undefined) {
                        if(xxx === posxxx && zzz === poszzz)
                            return true;
                        else
                            continue;
                    }
                    if(chunk.isInit !== 1) {
                        if(xxx === posxxx && zzz === poszzz)
                            return true;
                        else
                            continue;
                    }

                    var buffer = chunk.getBuffer([
                        Math.floor(cameraPos[0] - xxx*16),
                        Math.floor(cameraPos[1]),
                        Math.floor(cameraPos[2] - zzz*16)
                    ]);
                    if(buffer === false) continue;

                    //console.log(buffer.length);

                    var tak = 0;
                    tak += Intersection3D.shapeIntersectsShape(buffer, player.shape, 9, 5, cameraPos);
                    //if(tak > 0) console.log("tak: "+tak);
                    ttak += tak;
                }
            }
            
            //var timeNow3 = new Date().getTime();
            //console.log("czas "+(timeNow3-timeNow1));
            if(ttak>0) return true;
            return false;
    };
