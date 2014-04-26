function RegionLib(gameRoot, worldName){
    this.gameRoot = gameRoot;
    this.worldName = worldName;
    this.region = new Array();
    this.localIChunk = new Array();
    this.rchunk = new Array();
    this.iChunk = 0;
}

RegionLib.prototype.getChunkBlock = function(chx, chz, x, y, z){
    var i = chx*10000+chz;
    if(this.rchunk[i] !== undefined)
        return this.rchunk[i].getBlock(x,y,z);
    else
        return {id: 0, data: 0};
};

RegionLib.prototype.getBlock = function(x, y, z){
    var chx = Math.floor(x/16);
    var chz = Math.floor(z/16);
    var i = chx*10000+chz;
    var i = chx*10000+chz;
    if(this.rchunk[i] !== undefined){
        x = x - chx*16; if(x < 0) x+=16;
        z = z - chz*16; if(z < 0) z+=16;
        return this.rchunk[i].getBlock(x,y,z);
    } else
        return {id: 0, data: 0};
};

RegionLib.prototype.updateChunkBlock = function(chx, chz, x, y, z, b, d){
    var i = chx*10000+chz;
    if(this.rchunk[i] !== undefined)
        this.rchunk[i].updateBlock(x,y,z,b,d);
};

RegionLib.prototype.updateBlock = function(x, y, z, b, d){
    var chx = Math.floor(x/16);
    var chz = Math.floor(z/16);
    var i = chx*10000+chz;
    if(this.rchunk[i] !== undefined){
        x = x - chx*16; if(x < 0) x+=16;
        z = z - chz*16; if(z < 0) z+=16;
        this.rchunk[i].updateBlock(Math.floor(x),Math.floor(y),Math.floor(z),b,d);
    }
};

RegionLib.prototype.setBlock = function(x, y, z, b, d){
    var chx = Math.floor(x/16);
    var chz = Math.floor(z/16);
    var i = chx*10000+chz;
    if(this.rchunk[i] !== undefined){
        x = x - chx*16; if(x < 0) x+=16;
        z = z - chz*16; if(z < 0) z+=16;
        this.rchunk[i].setBlock(Math.floor(x),Math.floor(y),Math.floor(z),b,d);
    }
};

RegionLib.prototype.changeChunkBlockAdd = function(chx, chz, x, y, z){
    var i = chx*10000+chz;
    if(this.rchunk[i] !== undefined)
        this.rchunk[i].changeAdd(x,y,z);
};

RegionLib.prototype.updateChunks = function(){
    var timeNow1 = new Date().getTime();
    var i = 0;
    //rchunk.forEach(function(e) {
    for (var key in this.rchunk){
        if(this.rchunk[key] === undefined) continue;
        if(this.rchunk[key] === -1) continue;
        if(this.rchunk[key] === -2) continue;
        if(this.rchunk[key].needsUpdate === true) {
            this.rchunk[key].update();
            i++;
        }
    }
    var timeNow3 = new Date().getTime();
    console.log("update chunk "+(timeNow3-timeNow1)+" "+i);
};

RegionLib.prototype.deleteBuffers = function(){
    var timeNow1 = new Date().getTime();
    var i = 0;
    //rchunk.forEach(function(e) {
    for (var key in this.rchunk){
        if(this.rchunk[key] === undefined) continue;
        if(this.rchunk[key] === -1) continue;
        if(this.rchunk[key] === -2) continue;
        if(this.rchunk[key].changed === true) continue;
        if(this.rchunk[key].isInit === 1 || this.rchunk[key].isInit1 === 1)
            if(this.rchunk[key].timestamp + 10000 < timeNow1){
                this.rchunk[key].deleteBuffers();    
                this.rchunk[key] = undefined;
                i++;
            }
    }
    var timeNow3 = new Date().getTime();
    console.log("delete buffers "+(timeNow3-timeNow1)+" "+i);
};

RegionLib.prototype.render = function(){
        if(!initTexture) return;
        
        var shader = gluu.standardShader;
        gl.useProgram(shader);
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(settings.skyColor[0], settings.skyColor[1], settings.skyColor[2], 1);
        //gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        mat4.perspective(gluu.pMatrix, camera.fovy, gl.viewportWidth / gl.viewportHeight, 0.1, 6000.0);
        var lookAt = camera.getMatrix();
        mat4.multiply(gluu.pMatrix, gluu.pMatrix, lookAt);
        mat4.identity(gluu.mvMatrix);
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
                i = xxx*10000+zzz;
                
                if(this.rchunk[i] === -1 || this.rchunk[i] === -2) {
                    this.rchunk[i].timestamp = lastTime;
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
                
                if(this.rchunk[i] === undefined) {
                if(iLag > 1){
                    iLag -= 1;
                    this.requestChunk(xxx, zzz);
                    }
                    continue;
                }
                this.rchunk[i].timestamp = lastTime;
                
                if(cameraPos[1] >= 62 || lod < 10*16)
                    this.rchunk[i].render(drawLevel, shader, 0);
                if(cameraPos[1] < 62 && lod < 6*16)
                    this.rchunk[i].render(drawLevel, shader, 1);
                else if(lod < 4*16)
                    this.rchunk[i].render(drawLevel, shader, 1);
            }
        }
    };

RegionLib.prototype.renderSelection = function(){
        if(!initTexture) 
            return;
        
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
                i = xxx*10000+zzz;
                
                if(this.rchunk[i] === -1 || this.rchunk[i] === -2) {
                    this.rchunk[i].timestamp = lastTime;
                    continue;
                }
                if(this.rchunk[i] === undefined) {
                if(iLag > 1){
                    iLag -= 1;
                    this.requestChunk(xxx, zzz);
                    }
                    continue;
                }
                this.rchunk[i].timestamp = lastTime;
                
                this.rchunk[i].render(drawLevel, shader, 0);
                this.rchunk[i].render(drawLevel, shader, 1);
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

RegionLib.prototype.testCollisions = function(){
            var cameraPos = camera.getPos();
            var posxxx = Math.floor(cameraPos[0]/16);
            var poszzz = Math.floor(cameraPos[2]/16);
            var posx = 0;
            var posz = 0;
            //var xxx = posxxx + posx;
            //var zzz = poszzz + posz;
            var ttak = 0;
            var timeNow1 = new Date().getTime();
            for(var xxx = posxxx - 1; xxx < posxxx + 2; xxx++)
              for(var zzz = poszzz - 1; zzz < poszzz + 2; zzz++){
                if(xxx*16 - 2 < cameraPos[0] 
                && xxx*16 + 18 > cameraPos[0]
                && zzz*16 - 2 < cameraPos[2] 
                && zzz*16 + 18 > cameraPos[2]){ 
                
                    var i = xxx*10000+zzz;
                    if(this.rchunk[i] === -1 || this.rchunk[i] === -2) {
                        continue;
                    }
                    if(this.rchunk[i] === undefined) {
                        return true;
                    }
                    var buffer = this.rchunk[i].getBuffer([
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
            
            var timeNow3 = new Date().getTime();
            //console.log("czas "+(timeNow3-timeNow1));
            if(ttak>0) return true;
            return false;
    }

RegionLib.prototype.save = function(){
    for (var key in rchunk) {
        if(this.rchunk[key] === undefined || this.rchunk[key] === -1 || this.rchunk[key] === -2) continue;
        //console.log(this.rchunk[key]);
        if(this.rchunk[key].changed){
            mcWorld.saveChunkToStorage(this.rchunk[key].xPos, this.rchunk[key].zPos);
            this.rchunk[key].changed = false;
        }
    }
};

RegionLib.prototype.saveChunkToStorage = function(x, z){
    var i = x*10000+z;
    if(this.rchunk[i] === undefined) return;
    if(this.rchunk[i] === -1 || this.rchunk[i] === -2) return;
    
    var nbt = this.rchunk[i].getNBT();
    var deflate = new Zlib.Deflate(nbt);
    var nbt3 = deflate.compress();

    var nbt4 = new Uint8Array(nbt3.length + 5);
    
    var length = nbt3.length + 1;
    nbt4[0] = (length>>24) & 0xFF;
    nbt4[1] = (length>>16) & 0xFF;
    nbt4[2] = (length>>8) & 0xFF;
    nbt4[3] = length & 0xFF;
    nbt4[4] = 2;
    
    for(var i = 0; i < nbt3.length; i++ ){
        nbt4[i+5] = nbt3[i];
    }
    //////////
    
    var str = ab2str(nbt4);
    
    window.localStorage.setItem(this.gameRoot+" "+this.worldName+" "+x+" "+z, str);
};

RegionLib.prototype.getChunkFromStorage = function(x, z){
    var str = window.localStorage.getItem(this.gameRoot+" "+this.worldName+" "+x+" "+z);
    if(str === undefined) return -1;    
    if(str === null) return -1;    
    if(str === "") return -1;
    var nbt4 = new Uint8Array(str2ab(str));
    return RegionLib.loadChunk(0, nbt4, true);
};

RegionLib.prototype.loadChunkFromStorage = function(x, z, all){

    var chunk = mcWorld.getChunkFromStorage(x, z); 
    //console.log(chunk);
    if(chunk === -1) return -1;
    if(all) return chunk;
    
    var i = x*10000+z;
    this.rchunk[i] = chunk;
    
    var nietlchunk = false;
    var nietrchunk = false;
    var nietfchunk = false;
    var nietbchunk = false;

    var tbchunk = mcWorld.requestChunk(x+1, z);
    if(tbchunk === undefined) nietbchunk = true;
    if(tbchunk === -1) nietbchunk = true;
    if(tbchunk === -2) nietbchunk = true;
    var tfchunk = mcWorld.requestChunk(x-1, z);
    if(tfchunk === undefined) nietfchunk = true;
    if(tfchunk === -1) nietfchunk = true;
    if(tfchunk === -2) nietfchunk = true;
    var tlchunk = mcWorld.requestChunk(x, z+1);
    if(tlchunk === undefined) nietlchunk = true;
    if(tlchunk === -1) nietlchunk = true;
    if(tlchunk === -2) nietlchunk = true;
    var trchunk = mcWorld.requestChunk(x, z-1);
    if(trchunk === undefined) nietrchunk = true;
    if(trchunk === -1) nietrchunk = true;
    if(trchunk === -2) nietrchunk = true;
        
    if(!nietbchunk){
        tbchunk.init2();
    }
    if(!nietfchunk){
        tfchunk.init2();
    }
    if(!nietlchunk){
        tlchunk.init2();
    }
    if(!nietrchunk){
        trchunk.init2();
    }
};

RegionLib.prototype.loadRegion = function(x, y){
    this.region[x*1000+y] = new Object();
    this.region[x*1000+y].loaded = -2;

    if(window['threadsCode'] !== undefined){
        var blob = new Blob([threadsCode["loadRegionThread"]], {type: 'application/javascript'});
        var worker = new Worker(window.URL.createObjectURL(blob));
    } else {
        var worker = new Worker("threads/loadRegionThread.js");
    }
    worker.regionLib = this;
    worker.region = this.region[x*1000+y];
    worker.onmessage = function(e){
        this.regionLib.regionLoaded(e);
    };
    worker.onerror = function(e){
        this.region.loaded = -1;
    };
    var path = this.gameRoot+"/worlds/"+this.worldName+"/region/r."+x+"."+y+".mca";
    var url = "";
    if(this.gameRoot.indexOf(":") === -1){
        //console.log(document.location);
        url = document.location.href.split(/\?|#/)[0];
        var index = url.indexOf('index');
        if (index !== -1) {
          url = url.substring(0, index);
        }
    }
    console.log(url+path);
    worker.postMessage({x: x, y: y, name: url+path});
};

RegionLib.prototype.regionLoaded = function(e){
        //console.log("wowlo");
        var x = e.data.x;
        var y = e.data.y;
        
        if(e.data.loaded !== 1){
            var region = this.region[x*1000+y];
            region.loaded = -1;
            return;
        }
        //console.log(e.data);
        
        var regionData = new Uint8Array(e.data.data);
        //console.log("xy:"+x+" "+y+" "+regionData.length);
        if(regionData.length < 1000){
            var region = this.region[x*1000+y];
            region.loaded = -1;
            return;
        }
        
        var region = this.region[x*1000+y];
        region.regionData = regionData;
        region.loaded = 0;
        region.chunkPos = new Array();
        region.chunkLen = new Array();
        for(var i = 0, j = 0; i<4096; i+=4, j++){
            region.chunkPos[j] = regionData[i]*256*256 + regionData[i+1]*256 + regionData[i+2];
            region.chunkLen[j] = regionData[i+3];
        }
};

RegionLib.prototype.loadRegionFile = function(region, regionFile){
    
        try{
            var regionData = Readfile.readRAW(regionFile);
        } catch(w) {
            console.log("nie ma pliku");
            return;
        }
        region.regionData = regionData;
        region.loaded = 0;
        region.chunkPos = new Array();
        region.chunkLen = new Array();
        for(var i = 0, j = 0; i<4096; i+=4, j++){
            region.chunkPos[j] = regionData[i]*256*256 + regionData[i+1]*256 + regionData[i+2];
            region.chunkLen[j] = regionData[i+3];
        }
        
        /*for(var i = 0; i<1024; i++){
            if(region.chunkPos[i]>0){
                console.log("chunk "+i+": "+region.chunkPos[i] + " " + region.chunkLen[i]);
                //var poss = chunkPos[i]*4096;
                //console.log("=== compresion "+region[poss+4]);
                
                this.iChunk++;
                var aPos = region.chunkPos[i]*4096;
                
                var chunk = this.loadChunk(aPos, regionData);
                this.rchunk[chunk.xPos*10000+chunk.zPos] = chunk;
                //console.log(this.rchunk[this.iChunk].xPos+" "+this.rchunk[this.iChunk].zPos);
            }
        }*/
    };
    
RegionLib.prototype.requestChunk = function(x, z){
    var i = x*10000+z;
    if(this.rchunk[i] !== undefined) {
        return this.rchunk[i];
    }

    if(this.localIChunk[i] !== 1){
        var chunk = -1;
        this.localIChunk[i] = 1;
        if((chunk = this.loadChunkFromStorage(x, z, true)) !== -1) {
            this.rchunk[i] = chunk;
            return chunk;
        }
    }
    
    var rx = Math.floor(x / 32.0);
    var rz = Math.floor(z / 32.0);
    if(this.region[rx*1000+rz] === undefined){
       this.loadRegion(rx, rz);
    }
    if(this.region[rx*1000+rz].loaded === -1){
        this.rchunk[i] = -1;
        return -1;
    }
    if(this.region[rx*1000+rz].loaded === -2){
        return -2;
    }
    if(this.region[rx*1000+rz].loaded === 0){ 
        var xi = (x % 32); if(xi < 0) xi += 32;
        var zi = (z % 32); if(zi < 0) zi += 32;
        var ii = ((xi) + (zi) * 32);
        //console.log("--- "+xi+" "+zi);
        if(this.region[rx*1000+rz].chunkPos[ii] > 0){
                console.log("chunk "+i+" : "+this.region[rx*1000+rz].chunkPos[ii] + " " + this.region[rx*1000+rz].chunkLen[ii]);
                //var poss = chunkPos[i]*4096;
                //console.log("=== compresion "+region[poss+4]);
                
                this.iChunk++;
                var aPos = this.region[rx*1000+rz].chunkPos[ii]*4096;

                this.rchunk[i] = RegionLib.loadChunk(aPos, this.region[rx*1000+rz].regionData, true);
                //console.log(this.rchunk[this.iChunk].xPos+" "+this.rchunk[this.iChunk].zPos);
                return this.rchunk[i];
        } else {
            this.rchunk[i] = -1;
        }
    }
};

RegionLib.loadChunk = function(aPos, region, compressed){

        var aLength = region[aPos+0]*256*256*256 + region[aPos+1]*256*256 + region[aPos+2]*256 + region[aPos+3];
        //console.log("=== length " + aLength);
        //console.log("=== compresion " + region[aPos+4]);

        var chunkData = new Object();
        var chunk = new Chunk();
        chunkData.offset = 0;
        
        try{
            if(compressed){
                var inflate = new Zlib.Inflate(region,{'index': aPos+5});
                chunkData.data = inflate.decompress();
            } else {
                chunkData.data = region;
            }
        } catch(e){
            console.log("fail");
            return -1;
        }
    

        var aTag;
        
        for(var itag = 0; itag < 2000; itag++){
            if((aTag = NBT.nextTag(chunkData)) === -1) break;
            switch(aTag.name){
                case "xPos":
                    chunk.xPos = aTag.value;
                    break;
                case "zPos":
                    chunk.zPos = aTag.value;
                    break; 
                case "HeightMap":
                    chunk.heightMap = aTag.data;
                    break; 
                case "Biomes":
                    chunk.biomes = aTag.data;
                    break; 
                case "LightPopulated":
                    chunk.lightPopulated = aTag.value;
                    break; 
                case "Sections":
                    //console.log("aaaaaaaaaaaaa");
                    RegionLib.readSections(aTag, chunk, chunkData);
                    //console.log("aaaaaaaaaaaaa2");
                    continue; 
            }
            if(aTag.type === 9) NBT.read9(aTag, chunk, chunkData);
        }
        
        //if(chunk.heightMap === undefined){
            chunk.initHeightMap();
        //}
        
        return chunk;
    };
    
RegionLib.readSections = function(tag, chunk, chunkData){
        var section = new Object();
        var aTag;
        for(var itag = 0; itag < tag.length; ){
            if((aTag = NBT.nextTag(chunkData)) === -1) {
                break;
            }
            if(aTag.type === 0) {
                if(section.add === undefined)
                    section.add = new Uint8Array(2048);
                chunk.section[section.y] = section;
                var section = new Object();
                itag++;
            }
            
            switch(aTag.name){
                case "Y":
                    section.y = aTag.value;
                    break;
                case "Blocks":
                    section.blocks = aTag.data;
                    break; 
                case "SkyLight":
                    section.skyLight = aTag.data;
                    break; 
                case "BlockLight":
                    section.blockLight = aTag.data;
                    break; 
                case "Add":
                    section.add = aTag.data;
                    break; 
                case "Data":
                    section.data = aTag.data;
                    break; 
            }
        }
    };
    