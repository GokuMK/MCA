function RegionLib(gameRoot, worldName){
    this.gameRoot = gameRoot;
    this.worldName = worldName;
    this.region = new Array();
    this.localIChunk = new Array();
}

RegionLib.prototype.save =  function(){
    for (var key in rchunk) {
        if(rchunk[key] === -1 || rchunk[key] === -2) continue;
        //console.log(rchunk[key]);
        if(rchunk[key].changed){
            mcWorld.saveChunkToStorage(rchunk[key].xPos, rchunk[key].zPos);
            rchunk[key].changed = false;
        }
    }
};

RegionLib.prototype.saveChunkToStorage = function(x, z){
    var i = x*10000+z;
    if(rchunk[i] === undefined) return;
    if(rchunk[i] === -1 || rchunk[i] === -2) return;
    
    var nbt = rchunk[i].getNBT();
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
    rchunk[i] = chunk;
    
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
    //this.loadRegionFile(this.region[x*1000+y], this.gameRoot+"/worlds/"+this.worldName+"/region/r."+x+"."+y+".mca");
    
    var worker = new Worker("loadRegionThread.js");
    worker.regionLib = this;
    worker.region = this.region[x*1000+y];
    worker.onmessage = function(e){
        this.regionLib.regionLoaded(e);
    };
    worker.onerror = function(e){
        this.region.loaded = -1;
    };
    var path = this.gameRoot+"/worlds/"+this.worldName+"/region/r."+x+"."+y+".mca";
    worker.postMessage({x: x, y: y, name: path});
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
                
                iChunk++;
                var aPos = region.chunkPos[i]*4096;
                
                var chunk = this.loadChunk(aPos, regionData);
                rchunk[chunk.xPos*10000+chunk.zPos] = chunk;
                //console.log(rchunk[iChunk].xPos+" "+rchunk[iChunk].zPos);
            }
        }*/
    };
    
RegionLib.prototype.requestChunk = function(x, z){
    var i = x*10000+z;
    if(rchunk[i] !== undefined) {
        return rchunk[i];
    }

    if(this.localIChunk[i] !== 1){
        var chunk = -1;
        this.localIChunk[i] = 1;
        if((chunk = this.loadChunkFromStorage(x, z, true)) !== -1) {
            rchunk[i] = chunk;
            return chunk;
        }
    }
    
    var rx = Math.floor(x / 32.0);
    var rz = Math.floor(z / 32.0);
    if(this.region[rx*1000+rz] === undefined){
       this.loadRegion(rx, rz);
    }
    if(this.region[rx*1000+rz].loaded === -1){
        rchunk[i] = -1;
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
                console.log("chunk "+i+": "+this.region[rx*1000+rz].chunkPos[ii] + " " + this.region[rx*1000+rz].chunkLen[ii]);
                //var poss = chunkPos[i]*4096;
                //console.log("=== compresion "+region[poss+4]);
                
                iChunk++;
                var aPos = this.region[rx*1000+rz].chunkPos[ii]*4096;

                rchunk[i] = RegionLib.loadChunk(aPos, this.region[rx*1000+rz].regionData, true);
                //console.log(rchunk[iChunk].xPos+" "+rchunk[iChunk].zPos);
                return rchunk[i];
        } else {
            rchunk[i] = -1;
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
        
        if(compressed){
            var inflate = new Zlib.Inflate(region,{'index': aPos+5});
            chunkData.data = inflate.decompress();
        } else {
            chunkData.data = region;
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
    