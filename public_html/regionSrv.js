function RegionSrv(server){
    this.rchunk = new Array();
    this.iChunk = 0;
    this.wsOpen = false;
    this.position = new Int32Array(6);
    this.wsMsg = new Object();
    this.wsMsg.offset = 0;
    this.wsMsg.data = new Uint8Array(100000);
    settings.allowTools = false;
    players = new Object();
    
    document.getElementById('servername').value = server;
    document.getElementById("loginDiv").style.display = 'block';
    return;
}

RegionSrv.prototype.connect = function(server, name){
    console.log(server + " " + name);
    
    name = name || "";
    if(name.length > 20){
        document.getElementById("servermessage").innerHTML = "Nickname too long, max 20";
        return;
    }
    if(name.length < 1){
        document.getElementById("servermessage").innerHTML = "Nickname too short, min 1";
        return;
    }
    this.nickname = name;
    player.setName(name);
    
    this.ws = new WebSocket("ws://"+server+"/ws");
    this.ws.regionSrv = this;
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = function(){
        //send nickname
        this.regionSrv.wsOpen = true;
        this.regionSrv.wsMsg.offset = 0;
        NBT.write8Tag(this.regionSrv.wsMsg, "Nickname", this.regionSrv.nickname);
        this.send(new Uint8Array(this.regionSrv.wsMsg.data.buffer,0,this.regionSrv.wsMsg.offset));    
    };
    
    this.ws.onmessage = function(evt){
        var msg = evt.data;
        //console.log("Message received: ");

        var data = new Object();
        data.offset = 0;
        data.data = new Uint8Array(evt.data);
        var aTag;
        
        if((aTag = NBT.nextTag(data)) === -1) return;
        //console.log("ddd "+aTag.name);
        switch(aTag.name){
            case "Update":
                //console.log("dostalem update");
                for(var j = 0; j < 2; j++){
                    if((aTag = NBT.nextTag(data)) === -1) break;
                    switch(aTag.name){
                        case "BlockUpdate":
                            console.log("bu "+aTag.length);
                            var length = aTag.length;
                            var update = 0;
                            for(var i = 0; i<length; i++){
                                var blockData = NBT.nextTag(data).data;
                                var source = NBT.nextTag(data).value;
                                if(!source.equalsIgnoreCase(this.regionSrv.nickname)){
                                    //if(length < 4) this.regionSrv.updateRawBlock(blockData, false);
                                    //else {
                                        this.regionSrv.setRawBlock(blockData);
                                        update++;
                                    //}
                                }
                            }
                            //if(update > 0) this.regionSrv.updateChunks();
                            break;
                        case "PlayerUpdate":
                            //console.log("pu "+aTag.length);
                            var length = aTag.length;
                            for(var i = 0; i<length; i++){
                                aTag = NBT.nextTag(data);
                                if(!aTag.name.equalsIgnoreCase(this.regionSrv.nickname)){
                                    //console.log(aTag.name);
                                    //console.log(aTag.data[0] + " " + aTag.data[1] + " " + aTag.data[2]);
                                    if(players[aTag.name] === undefined) {
                                        players[aTag.name] = new Player();
                                        players[aTag.name].name = aTag.name;
                                    }
                                    players[aTag.name].setPosRotRawInt(aTag.data);
                                    //this.regionSrv.setRawBlock(blockData);
                                }
                            }
                            break;
                    }
                }
                break;
            case "PlayerQuit":
                console.log("delp "+aTag.value);
                players[aTag.value] = undefined;
                break;    
            case "JoinGame":
                if((aTag = NBT.nextTag(data)) === -1) break;
                switch(aTag.name){
                    case "setPos":
                        console.log(aTag.tagId + " "+aTag.length);
                        var x = NBT.read3RawTag(data);
                        var y = NBT.read3RawTag(data);
                        var z = NBT.read3RawTag(data);
                        camera.setPos(x,y,z);
                        document.getElementById("loginDiv").style.display = 'none';
                        document.getElementById("webgl").style["-webkit-filter"] = "none";
                        document.getElementById("webgl").style["-moz-filter"] = "none";
                        _gameStop = false;
                        requestAnimFrame(tick);
                        break;
                }
                break;
            case "Kick":
                this.regionSrv.connectionClosed(aTag.value);
                break;   
            case "ChunkData":
                var xPos = NBT.nextTag(data).value;
                var zPos = NBT.nextTag(data).value;
                console.log("dostalem chunka "+xPos+" "+zPos);
                //console.log(this.regionSrv);
                //aTag = NBT.nextTag(data);
                var chunk = this.regionSrv.loadChunk(data.offset+13, data.data, true);
                if(chunk.xPos !== undefined && chunk.zPos !== undefined){
                    var i = xPos*10000+zPos;
                    this.regionSrv.rchunk[i] = chunk;
                }
                break;
            default:
                break;
        }
    };
    
    this.ws.onclose = function(){
        this.regionSrv.connectionClosed("Connection closed");
    };
};

RegionSrv.prototype.connectionClosed = function(msg){
        this.wsOpen = false;
        document.getElementById("loginDiv").style.display = 'block';
        document.getElementById("servermessage").innerHTML = msg;
        document.getElementById("webgl").style["-webkit-filter"] = "blur(5px)";
        document.getElementById("webgl").style["-moz-filter"] = "blur(5px)";
        _gameStop = true;
        this.deleteBuffers(true);
        this.rchunk = new Array();
        players = new Array();
        document.exitPointerLock();
        camera.moveX = 0;
        camera.moveY = 0;
        console.log("WebSocket closed." + msg);    
};
RegionSrv.prototype.new100msec = function(){
    
};
RegionSrv.prototype.new50msec = function(){
    if(this.wsOpen){
        var pos = player.getPos();
        var rot = player.getRot();
        
        this.position[0] = Math.floor(pos[0]*100);
        this.position[1] = Math.floor(pos[1]*100);
        this.position[2] = Math.floor(pos[2]*100);
        this.position[3] = Math.floor(rot[0]*100);
        this.position[4] = Math.floor(rot[1]*100);
        this.position[5] = Math.floor(lastTime);
        this.wsMsg.offset = 0;
        NBT.write11Tag(this.wsMsg, "Position", this.position, 6);

        this.ws.send(new Uint8Array(this.wsMsg.data.buffer,0,this.wsMsg.offset));    
        //console.log(pos[0]+" "+pos[1]+" "+pos[2]);
        //console.log(rot);
    }
};

RegionSrv.prototype.getNearestPosition = function(pos){
    var chx = Math.floor(pos[0]/16);
    var chz = Math.floor(pos[2]/16);
    var i = chx*10000+chz;
    if(this.rchunk[i] !== undefined && this.rchunk[i] !== -1 && this.rchunk[i] !== -2){
        var ix = pos[0] - chx*16; if(ix < 0) ix+=16;
        var iz = pos[2] - chz*16; if(iz < 0) iz+=16;
        var chPos = this.rchunk[i].getNearestPosition([ix,pos[1],iz]);
        if(chPos !== false)
            return [chx*16 + chPos[0], chPos[1], chz*16 + chPos[2]];
    }
    return false;
};

RegionSrv.prototype.getChunkBlock = function(chx, chz, x, y, z){
    var i = chx*10000+chz;
    if(this.rchunk[i] !== undefined && this.rchunk[i] !== -1 && this.rchunk[i] !== -2)
        return this.rchunk[i].getBlock(x,y,z);
    else
        return {id: 0, data: 0};
};

RegionSrv.prototype.getBlock = function(x, y, z){
    var chx = Math.floor(x/16);
    var chz = Math.floor(z/16);
    var i = chx*10000+chz;
    var i = chx*10000+chz;
    if(this.rchunk[i] !== undefined && this.rchunk[i] !== -1 && this.rchunk[i] !== -2){
        x = x - chx*16; if(x < 0) x+=16;
        z = z - chz*16; if(z < 0) z+=16;
        return this.rchunk[i].getBlock(x,y,z);
    } else
        return {id: 0, data: 0};
};

RegionSrv.prototype.updateChunkBlock = function(chx, chz, x, y, z, b, d){
    var i = chx*10000+chz;
    if(this.rchunk[i] !== undefined && this.rchunk[i] !== -1 && this.rchunk[i] !== -2)
        this.rchunk[i].updateBlock(x,y,z,b,d);
    
    this.sendBlockData(x+chx*16, y, z+chz*16, b, d);
};

RegionSrv.prototype.setRawBlock = function(raw){
    this.setBlock(raw[0], raw[1], raw[2], raw[3], raw[4]);
};

RegionSrv.prototype.updateRawBlock = function(raw, send){
     this.updateBlock(raw[0], raw[1], raw[2], raw[3], raw[4], send);
};

RegionSrv.prototype.updateBlock = function(x, y, z, b, d, send){
    if(send === undefined) send = true;
    var chx = Math.floor(x/16);
    var chz = Math.floor(z/16);
    var i = chx*10000+chz;

    if(send) this.sendBlockData(x, y, z, b, d);
    
    if(this.rchunk[i] !== undefined && this.rchunk[i] !== -1 && this.rchunk[i] !== -2){
        x = x - chx*16; if(x < 0) x+=16;
        z = z - chz*16; if(z < 0) z+=16;
        this.rchunk[i].updateBlock(Math.floor(x),Math.floor(y),Math.floor(z),b,d);
    }
};

RegionSrv.prototype.setBlock = function(x, y, z, b, d){
    var chx = Math.floor(x/16);
    var chz = Math.floor(z/16);
    var i = chx*10000+chz;
    if(this.rchunk[i] !== undefined && this.rchunk[i] !== -1 && this.rchunk[i] !== -2){
        x = x - chx*16; if(x < 0) x+=16;
        z = z - chz*16; if(z < 0) z+=16;
        this.rchunk[i].setBlock(Math.floor(x),Math.floor(y),Math.floor(z),b,d);
    }
};

RegionSrv.prototype.changeChunkBlockAdd = function(chx, chz, x, y, z){
    var i = chx*10000+chz;
    if(this.rchunk[i] !== undefined && this.rchunk[i] !== -1 && this.rchunk[i] !== -2)
        this.rchunk[i].changeAdd(x,y,z);
};

RegionSrv.prototype.updateChunks = function(){
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
    if(i > 0)
        console.log("update chunk "+(timeNow3-timeNow1)+" "+i);
};

RegionSrv.prototype.deleteBuffers = function(all){
    all = all || false;
    var timeNow1 = new Date().getTime();
    var i = 0;
    //rchunk.forEach(function(e) {
    for (var key in this.rchunk){
        if(this.rchunk[key] === undefined) continue;
        if(this.rchunk[key] === -1) continue;
        if(this.rchunk[key] === -2) continue;
        if(this.rchunk[key].changed === true) continue;
        if(this.rchunk[key].isInit === 1 || this.rchunk[key].isInit1 === 1)
            if(this.rchunk[key].timestamp + 10000 < timeNow1 || all){
                this.rchunk[key].deleteBuffers();    
                this.rchunk[key] = undefined;
                i++;
            }
    }
    var timeNow3 = new Date().getTime();
    console.log("delete buffers "+(timeNow3-timeNow1)+" "+i);
};

RegionSrv.prototype.save = function(){
    console.log("not supported");
};
    
RegionSrv.prototype.requestChunk = function(x, z, load){
    var i = x*10000+z;
    if(load === undefined) load = true;
    
    if(this.rchunk[i] !== undefined || !load) {
        return this.rchunk[i];
    }
    
    if(_gameStop) return undefined;
    
    //var msg = new Uint8Array(8);
    this.wsMsg.offset = 0;
    
    NBT.write10Tag(this.wsMsg, "Chunk");
    NBT.write3Tag(this.wsMsg, "xPos", x);
    NBT.write3Tag(this.wsMsg, "zPos", z);
    NBT.write0Tag(this.wsMsg);

    this.ws.send(new Uint8Array(this.wsMsg.data.buffer,0,this.wsMsg.offset));    
    this.rchunk[i] = -2;
    return this.rchunk[i];
};

RegionSrv.prototype.sendBlockData = function(x,y,z,b,d){
    //var msg = new Uint8Array(100);
    this.wsMsg.offset = 0;
    
    NBT.write10Tag(this.wsMsg, "BlockData");
    NBT.write3Tag(this.wsMsg, "x", x);
    NBT.write3Tag(this.wsMsg, "y", y);
    NBT.write3Tag(this.wsMsg, "z", z);
    NBT.write3Tag(this.wsMsg, "b", b);
    NBT.write3Tag(this.wsMsg, "d", d);
    NBT.write0Tag(this.wsMsg);

    this.ws.send(new Uint8Array(this.wsMsg.data.buffer,0,this.wsMsg.offset));    
}
    
RegionSrv.prototype.chunkDataReceived = function(){

};

RegionSrv.prototype.loadChunk = function(aPos, region, compressed){

        var aLength = region[aPos+0]*256*256*256 + region[aPos+1]*256*256 + region[aPos+2]*256 + region[aPos+3];
        //console.log("=== length " + aLength);
        //console.log("=== compresion " + region[aPos+4]);
        //console.log(aLength);
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
        
        //console.log(chunk.xPos + " " + chunk.zPos);
        if(chunk.heightMap === undefined){
            chunk.initHeightMap();
        }
        
        chunk.isInit = 0;
        chunk.isInit1 = 0;
        return chunk;
    };
    
RegionSrv.prototype.readSections = function(tag, chunk, chunkData){
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
    