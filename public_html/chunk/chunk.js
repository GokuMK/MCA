function Chunk(){
        this.section = new Array();
        this.isInit = 0;
        this.isInit1 = 0;
        this.visible = true;
        this.changed = false;
        this.ivbo = new Array();
        this.vbo = new Array();
        this.needsUpdate = false;
        this.timestamp = new Date().getTime();
}

Chunk.stairsData = new Array();

Chunk.stairsData["20xx2"] = "0001";
Chunk.stairsData["21x2x"] = "0010";
Chunk.stairsData["11x2x"] = "0010";
Chunk.stairsData["1x13x"] = "1000";
Chunk.stairsData["3x0x3"] = "0100";
Chunk.stairsData["3x13x"] = "1000";
Chunk.stairsData["00xx2"] = "0001";
Chunk.stairsData["0x0x3"] = "0100";

Chunk.stairsData["31xx3"] = "1110";
Chunk.stairsData["30x3x"] = "1101";
Chunk.stairsData["00x3x"] = "1101";
Chunk.stairsData["0x02x"] = "0111";
Chunk.stairsData["2x1x2"] = "1011";
Chunk.stairsData["2x02x"] = "0111";
Chunk.stairsData["11xx3"] = "1110";
Chunk.stairsData["1x1x2"] = "1011";

Chunk.stairsData["64xx6"] = "0001";
Chunk.stairsData["65x6x"] = "0010";
Chunk.stairsData["55x6x"] = "0010";
Chunk.stairsData["5x57x"] = "1000";
Chunk.stairsData["7x4x7"] = "0100";
Chunk.stairsData["7x57x"] = "1000";
Chunk.stairsData["44xx6"] = "0001";
Chunk.stairsData["4x4x7"] = "0100";

Chunk.stairsData["75xx7"] = "1110";
Chunk.stairsData["74x7x"] = "1101";
Chunk.stairsData["44x7x"] = "1101";
Chunk.stairsData["4x46x"] = "0111";
Chunk.stairsData["6x5x6"] = "1011";
Chunk.stairsData["6x46x"] = "0111";
Chunk.stairsData["55xx7"] = "1110";
Chunk.stairsData["5x5x6"] = "1011";

Chunk.cacheSlight = new Float32Array(258*18*18);
Chunk.cacheBlight = new Float32Array(258*18*18);
Chunk.cacheData = new Float32Array(258*18*18);
Chunk.cacheId = new Float32Array(258*18*18);
Chunk.cacheBlock = new Float32Array(18*18*18);
//Chunk.cacheBiome = new Float32Array(18*18);
Chunk.cacheHeightMap9 = new Uint8Array(48*48);
Chunk.cacheHeightMap9hMax = new Uint8Array(48*48);
Chunk.cacheSlight9 = new Uint8Array(258*48*48);
Chunk.cacheBlight9 = new Uint8Array(258*48*48);
Chunk.cacheId9 = new Int32Array(258*48*48);

Chunk.prototype.initHeightMap = function(){
    var index = 0;
    this.heightMap = new Uint32Array(256);
    for(var z = 0; z < 16; z++)
        for(var x = 0; x < 16; x++)
            for(var i = 255, y = 15; i > 0; i--, y--){
                if((i-15)%16 === 0){
                    var asection = this.section[(i-15)/16];
                    y = 15;
                    if(asection === undefined){
                        i-=15;
                        y = 16;
                        continue;
                    }
                }
                index = y*256+z*16+x;
                if(block.lightTransmission[asection.blocks[index]] !== 1.0){
                    this.heightMap[z*16+x] = i+1;
                    break;
                }
            }
            //console.log(this.heightMap);
    };

Chunk.prototype.refreshLight = function(blockH, lightInit){
    var aindex = 0, lindex = 0, rindex = 0, lindex = 0, findex = 0, bindex = 0, tindex = 0, dindex = 0;
    var index = 0, index2 = 0;
    
    var timeNow1 = new Date().getTime();
    
    lightInit = lightInit || false;
    this.initHeightMap();
    if(!this.getCacheL9()) return false;
    
    var lightSource = block.lightSource;
    var lightTransmission = block.lightTransmission;
    var cacheSlight9 = Chunk.cacheSlight9;
    var cacheBlight9 = Chunk.cacheBlight9;
    var cacheId9 = Chunk.cacheId9;
    
    //find min/max level of sunlight
    var hMin = 256;
    var hMax = 0;
    var yy = 0;
    var y = 0;
    for(var z = 0; z < 48; z++)
        for(var x = 0; x < 48; x++){
            y = Chunk.cacheHeightMap9[z*48+x];
            if(y > hMax) hMax = y;
            if(y < hMin) hMin = y;
            yy = 0;
            for(var i = -1; i<=1; i++)
                for(var j = -1; j<=1; j++){
                    if(z+i < 0 || x+j < 0 || z+i > 47 || x+j > 47) continue;
                    y = Chunk.cacheHeightMap9[(z+i)*48+(x+j)];
                    if(y > yy) yy = y;
                }
            Chunk.cacheHeightMap9hMax[z*48+x] = yy+1;
        }
    
    //sunlight down propagation
    for(var z = 2; z < 46; z++)
        for(var x = 2; x <46; x++){
            var y = Chunk.cacheHeightMap9hMax[z*48+x];
            for(; y >= Chunk.cacheHeightMap9[z*48+x]; y--){
                index2 = y*2304 + z*48 + x;
                cacheSlight9[index2] = 15;
            }
            var t = 15;
            for(; y >= 0; y--){
                index2 = y*2304 + z*48 + x;
                t *= lightTransmission[cacheId9[index2]];
                cacheSlight9[index2] = t;
                if(t > 0 && y < hMin) hMin = y;
            }
        }
        
    for(var z = 0; z < 48; z++)
             for(var y = 0; y < 255; y++){
                index2 = y*2304 + z*48 + 1;
                if(cacheSlight9[index2] > 0 && y < hMin) {hMin = y; break;}
             }
    for(var z = 0; z < 48; z++)
             for(var y = 0; y < 255; y++){
                index2 = y*2304 + z*48 + 46;
                if(cacheSlight9[index2] > 0 && y < hMin) {hMin = y; break;}
             }
    for(var x = 0; x < 48; x++)
             for(var y = 0; y < 255; y++){
                index2 = y*2304 + 1*48 + x;
                if(cacheSlight9[index2] > 0 && y < hMin) {hMin = y; break;}
             }
    for(var x = 0; x < 48; x++)
             for(var y = 0; y < 255; y++){
                index2 = y*2304 + 46*48 + x;
                if(cacheSlight9[index2] > 0 && y < hMin) {hMin = y; break;}
             }
    hMin--;
    if(hMin < 1) hMin = 1;
    
    //find min/max level of blocklight
    var t = 0;
    if(blockH === -1){
        var bMin = 0;
        var bMax = 256;
    } else {
        bMin = blockH - 16; if(bMin < 0) bMin = 0;
        bMax = blockH + 16; if(bMax > 256) bMax = 256;
    }
     
    var bbMin = 255, bbMax = 0;
    for(var z = 2; z < 46; z++)
       for(var x = 2; x < 46; x++)
          for(var y = bMin + 1; y < bMax - 1; y++){
             aindex = (y)*2304 + (z)*48 + (x);
             cacheBlight9[aindex] = lightSource[cacheId9[aindex]];
             if(cacheBlight9[aindex] > 0 && y < bbMin) bbMin = y;
             if(cacheBlight9[aindex] > 0 && y > bbMax) bbMax = y;
          }
  
    var isNewBlockLight = false;
    if(blockH === -1){
        bMin = bbMin - 16; if(bMin < 0) bMin = 0;
        bMax = bbMax + 16; if(bMax > 256) bMax = 256;
        isNewBlockLight = true;
    } else {
        for(aindex = bMin*2304; aindex < bMax*2304; aindex++){
            if(cacheBlight9[aindex] > 0) {
                isNewBlockLight = true; 
                break;
            }
        }
    }
    
    var timeNow3 = new Date().getTime();
    console.log("czas L0 "+(timeNow3-timeNow1));
    var timeNow1 = new Date().getTime();
    //propagacja Blight
    if(isNewBlockLight)
    for(var it = 0; it < 14; it++)
       for(var z = 1; z < 47; z++)
          for(var x = 1; x < 47; x++)
             for(var y = bMin; y < bMax; y++){
                aindex = (y)*2304 + (z)*48 + (x);
                t = cacheBlight9[aindex] - 1;
                if(t < 1) continue;
                lindex = aindex + 48;
                rindex = aindex - 48;
                findex = aindex - 1;
                bindex = aindex + 1;
                tindex = aindex + 2304;
                dindex = aindex - 2304;

                if(t*lightTransmission[cacheId9[dindex]] > cacheBlight9[dindex])
                    cacheBlight9[dindex] = t*lightTransmission[cacheId9[dindex]];
                if(t*lightTransmission[cacheId9[tindex]] > cacheBlight9[tindex])
                    cacheBlight9[tindex] = t*lightTransmission[cacheId9[tindex]];

                if(t*lightTransmission[cacheId9[lindex]] > cacheBlight9[lindex])
                    cacheBlight9[lindex] = t*lightTransmission[cacheId9[lindex]];

                if(t*lightTransmission[cacheId9[rindex]] > cacheBlight9[rindex])
                    cacheBlight9[rindex] = t*lightTransmission[cacheId9[rindex]];

                if(t*lightTransmission[cacheId9[findex]] > cacheBlight9[findex])
                    cacheBlight9[findex] = t*lightTransmission[cacheId9[findex]];

                if(t*lightTransmission[cacheId9[bindex]] > cacheBlight9[bindex])
                    cacheBlight9[bindex] = t*lightTransmission[cacheId9[bindex]];

            }
    
    var timeNow3 = new Date().getTime();
    console.log("czas L1 "+(timeNow3-timeNow1));
    //console.log("hmin "+ hMin);
    var timeNow1 = new Date().getTime();
    
    //propagacja Slight
    var tSum = 0;
    var t = 0;
    
    for(var it = 0; it < 14; it++)
       for(var z = 1; z < 47; z++)
          for(var x = 1; x < 47; x++)
             for(var y = hMin; y < Chunk.cacheHeightMap9hMax[z*48+x]; y++){
                aindex = (y)*2304 + (z)*48 + (x);
                t = cacheSlight9[aindex] - 1;
                if(t < 1) continue;
                lindex = aindex + 48;
                rindex = aindex - 48;
                findex = aindex - 1;
                bindex = aindex + 1;
                tindex = aindex + 2304;
                dindex = aindex - 2304;

                if(t*lightTransmission[cacheId9[dindex]] > cacheSlight9[dindex])
                    cacheSlight9[dindex] = t*lightTransmission[cacheId9[dindex]];
                
                if(t*lightTransmission[cacheId9[tindex]] > cacheSlight9[tindex])
                    cacheSlight9[tindex] = t*lightTransmission[cacheId9[tindex]];
                
                if(t*lightTransmission[cacheId9[lindex]] > cacheSlight9[lindex])
                    cacheSlight9[lindex] = t*lightTransmission[cacheId9[lindex]];

                if(t*lightTransmission[cacheId9[rindex]] > cacheSlight9[rindex])
                    cacheSlight9[rindex] = t*lightTransmission[cacheId9[rindex]];

                if(t*lightTransmission[cacheId9[findex]] > cacheSlight9[findex])
                    cacheSlight9[findex] = t*lightTransmission[cacheId9[findex]];

                if(t*lightTransmission[cacheId9[bindex]] > cacheSlight9[bindex])
                    cacheSlight9[bindex] = t*lightTransmission[cacheId9[bindex]];

            }

    var timeNow3 = new Date().getTime();
    console.log("czas L2 "+(timeNow3-timeNow1));
    var timeNow1 = new Date().getTime();
    //zapisanie
    
    var chunk = new Array();
        for(var i = -1; i<=1; i++)
            for(var j = -1; j<=1; j++){
                chunk[(i+1)*3+j+1] = mcWorld.requestChunk(this.xPos+i, this.zPos+j);
                if(chunk[(i+1)*3+j+1] === -2) return false;
            }
        
    var iChunk;
    var newChunk = [0,0,0,0,0,0,0,0,0];
    var hashSlight = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var hashBlight = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    //lightInit = true;
    if(lightInit) 
        var newChunk = [0,1,0,1,1,1,0,1,0];
    
    for(var iCh = 0; iCh<=2; iCh++)
        for(var jCh = 0; jCh<=2; jCh++){
            if(lightInit)
                if(iCh !== 1 && jCh !== 1) continue;

            iChunk = chunk[(iCh)*3+jCh];
            if(iChunk === undefined || iChunk === -1)
                continue;
                
            for(var i = 0, y = 0; i < 256; i++, y++){
                if(i%16 === 0){
                    var asection = iChunk.section[i/16];
                    y = 0;
                    if(asection === undefined){
                        i+=15;
                        y = -1;
                        continue;
                    }
                    if(!lightInit){
                        hashSlight[i/16] = jenkins_hash(asection.skyLight);
                        hashBlight[i/16] = jenkins_hash(asection.blockLight);
                    }
                }       
                for(var z = 0; z < 16; z++){
                    for(var x = 0; x < 16; x+=2){
                        index = (y*256+z*16+x)/2;
                        index2 = (i)*2304 + (jCh*16+z)*48 + (iCh*16+x);
                        asection.skyLight[index] = cacheSlight9[index2] + (cacheSlight9[index2+1] << 4);
                        asection.blockLight[index] = cacheBlight9[index2] + (cacheBlight9[index2+1] << 4);
                    }
                }
            }
            //console.log(hashSlight);
            var hh = 0;
            if(!lightInit)
                for(var i = 0; i < 16; i++){
                    if(iChunk.section[i] === undefined) continue;
                    hh = jenkins_hash(iChunk.section[i].skyLight);
                    if(hashSlight[i] !== hh){
                        newChunk[(iCh)*3+jCh] = 1;
                        break;
                        //console.log("rozne");
                    }
                    hh = jenkins_hash(iChunk.section[i].blockLight);
                    if(hashBlight[i] !== hh){
                        newChunk[(iCh)*3+jCh] = 1;
                        break;
                        //console.log("rozne");
                    }
                }
            //console.log(hashSlight2);
        }
    var timeNow3 = new Date().getTime();
    console.log("czas L3 "+(timeNow3-timeNow1));
    
    return newChunk;
    };

Chunk.prototype.getBiomeColor1 = function(x, z, idx){ 
    var color, color1, color2, aBiomeIdx;
    aBiomeIdx = this.cacheBiomes[(z+0)*18+x+0];
    color = biomes[aBiomeIdx].colorR[idx]; color1 = biomes[aBiomeIdx].colorG[idx]; color2 = biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+0)*18+x+1];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+1)*18+x+0];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    //    color/=3; color1/=3; color2/=3;
    aBiomeIdx = this.cacheBiomes[(z+1)*18+x+1];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];

    color = Math.floor(color/4)*256*256 + Math.floor(color1/4)*256 + Math.floor(color2/4);
    return color;    
    };  
    
Chunk.prototype.getBiomeColor2 = function(x, z, idx){ 
    var color, color1, color2, aBiomeIdx;
    aBiomeIdx = this.cacheBiomes[(z+0)*18+x+2];
    color = biomes[aBiomeIdx].colorR[idx]; color1 = biomes[aBiomeIdx].colorG[idx]; color2 = biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+0)*18+x+1];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+1)*18+x+2];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    //    color/=3; color1/=3; color2/=3;
    aBiomeIdx = this.cacheBiomes[(z+1)*18+x+1];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];

    color = Math.floor(color/4)*256*256 + Math.floor(color1/4)*256 + Math.floor(color2/4);
    return color;    
    };  
    
Chunk.prototype.getBiomeColor3 = function(x, z, idx){ 
    var color, color1, color2, aBiomeIdx;
    aBiomeIdx = this.cacheBiomes[(z+2)*18+x+2];
    color = biomes[aBiomeIdx].colorR[idx]; color1 = biomes[aBiomeIdx].colorG[idx]; color2 = biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+2)*18+x+1];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+1)*18+x+2];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    //    color/=3; color1/=3; color2/=3;
    aBiomeIdx = this.cacheBiomes[(z+1)*18+x+1];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];

    color = Math.floor(color/4)*256*256 + Math.floor(color1/4)*256 + Math.floor(color2/4);
    return color;    
    };  
    
Chunk.prototype.getBiomeColor4 = function(x, z, idx){ 
    var color, color1, color2, aBiomeIdx;
    aBiomeIdx = this.cacheBiomes[(z+2)*18+x+0];
    color = biomes[aBiomeIdx].colorR[idx]; color1 = biomes[aBiomeIdx].colorG[idx]; color2 = biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+2)*18+x+1];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+1)*18+x+0];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    //color/=3; color1/=3; color2/=3;
    aBiomeIdx = this.cacheBiomes[(z+1)*18+x+1];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    color = Math.floor(color/4)*256*256 + Math.floor(color1/4)*256 + Math.floor(color2/4);
    return color;    
    };  
    
Chunk.prototype.getBiomeColor = function(x, z, idx){ 
    var color, color1, color2, aBiomeIdx;
    aBiomeIdx = this.cacheBiomes[(z+2)*18+x+2];
    color = biomes[aBiomeIdx].colorR[idx]; color1 = biomes[aBiomeIdx].colorG[idx]; color2 = biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+0)*18+x+0];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+2)*18+x+0];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+0)*18+x+2];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+1)*18+x+2];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+1)*18+x+0];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+2)*18+x+1];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    aBiomeIdx = this.cacheBiomes[(z+0)*18+x+1];
    color += biomes[aBiomeIdx].colorR[idx]; color1 += biomes[aBiomeIdx].colorG[idx]; color2 += biomes[aBiomeIdx].colorB[idx];
    color = Math.floor(color/8)*256*256 + Math.floor(color1/8)*256 + Math.floor(color2/8);
    return color;    
    };  
    
Chunk.prototype.getBlock = function(x,h,z){
        if(this.isInit === -1)
            return {id: 0, data: 0};

        var yy = Math.floor(h/16);
        var y = h - yy*16;
        var index = y*256+z*16+x;
        
        if(this.section[yy] === undefined) 
            return {id: 0, data: 0};
        
        var id = this.section[yy].blocks[index];
        var data = 0;
        var skyf = index % 2;
        if(skyf === 0){
            data = (this.section[yy].data[(index/2)] & 0x0F);
        }else{
            data = (this.section[yy].data[(index/2 - 0.5)] & 0xF0) >> 4;
        }
        
        return {id: id, data: data};
};
    
Chunk.prototype.getNBT = function(y){
    var nbt = new Object();
    nbt.offset = 0;
    nbt.data = new Uint8Array(500000);
    
    NBT.write10Tag(nbt, "");
    NBT.write10Tag(nbt, "Level");
    
    NBT.write3Tag(nbt, "xPos", this.xPos);
    NBT.write3Tag(nbt, "zPos", this.zPos);
    NBT.write7Tag(nbt, "Biomes", this.biomes);
    
    NBT.write9Tag(nbt, "Sections", 10, this.section.length);

    for(var i = 0; i < this.section.length; i++){
        NBT.write1Tag(nbt, "Y", this.section[i].y);
        NBT.write7Tag(nbt, "Data", this.section[i].data);
        NBT.write7Tag(nbt, "SkyLight", this.section[i].skyLight);
        NBT.write7Tag(nbt, "BlockLight", this.section[i].blockLight);
        NBT.write7Tag(nbt, "Blocks", this.section[i].blocks);
        NBT.write0Tag(nbt);
    }
    
    NBT.write0Tag(nbt);
    NBT.write0Tag(nbt);
    
    return new Uint8Array(nbt.data.buffer, 0, nbt.offset);
    };
    
Chunk.prototype.newSection = function(y){
    this.section[y] = new Object();
    this.section[y].y = y;
    this.section[y].blocks = new Uint32Array(4096);
    this.section[y].skyLight = new Uint32Array(2048);
    
    for(var i = 0; i<2048; i++)
        this.section[y].skyLight[i] = 255;
    this.section[y].blockLight = new Uint32Array(2048);
    this.section[y].data = new Uint32Array(2048);
    this.section[y].add = new Uint32Array(2048);
};

Chunk.prototype.changeAdd = function(x, h, z){
        if(this.isInit === -1)
            return;
        
        //this.changed = true;

        var yy = Math.floor(h/16);
        var y = h - yy*16;
        var index = y*256+z*16+x;
        
        var add = 0;
        var skyf = index % 2;
        if(this.section[yy] === undefined) this.newSection(yy);
        
        if(skyf === 0){
            add = (this.section[yy].add[(index/2)] & 0x0F);
        }else{
            add = ((this.section[yy].add[(index/2 - 0.5)] >> 4) & 0x0F);
        }  
        add++;
        if(add === 10) add = 0;
        
        if(skyf === 0){
            this.section[yy].add[(index/2)] = (this.section[yy].add[(index/2)] & 0xF0) + add;
        }else{
            this.section[yy].add[(index/2 - 0.5)] = (this.section[yy].add[(index/2 - 0.5)] & 0x0F) + (add << 4);
        }
        
        this.init2(0);
        this.init2(1);
};

Chunk.prototype.updateBlock = function(x, h, z, id, data){
        if(this.isInit === -1)
            return;
        var timeNow1 = new Date().getTime();

        this.changed = true;

        var yy = Math.floor(h/16);
        var y = h - yy*16;
        var index = y*256+z*16+x;
        
        if(this.section[yy] === undefined) this.newSection(yy);
        this.section[yy].blocks[index] = id;
        
        var skyf = index % 2;
        if(skyf === 0){
            this.section[yy].data[(index/2)] = (this.section[yy].data[(index/2)] & 0xF0) + data;
            this.section[yy].add[(index/2)] = (this.section[yy].add[(index/2)] & 0xF0);
        }else{
            this.section[yy].data[(index/2 - 0.5)] = (this.section[yy].data[(index/2 - 0.5)] & 0x0F) + (data << 4);
            this.section[yy].add[(index/2 - 0.5)] = (this.section[yy].add[(index/2 - 0.5)] & 0x0F);
        }
        
        ////// sunlight
        var newSkyLight = 0;
        if(block[id].type === 0 || block[id].type === 2 || block[id].type === 3 || block[id].type === 4){
            newSkyLight = this.getSunLightValue(x,h+1,z);
            var blight = 0;
            for(var i = -1; i <= 1; i++)
                for(var j = -1; j<= 1; j++){
                    if((i !== 0) && (j !== 0)) continue;
                    if(x+i < 0)  continue;
                    if(x+i > 15)  continue;
                    if(z+j < 0)  continue;
                    if(z+j > 15)  continue;
                    blight = this.getSunLightValue(x+i,h,z+j);
                    if(blight - 1 > newSkyLight) newSkyLight = blight - 1;
                }
        }

        if(skyf === 0){
            this.section[yy].skyLight[(index/2)] = (this.section[yy].skyLight[(index/2)] & 0xF0) + newSkyLight;
        }else{
            this.section[yy].skyLight[(index/2 - 0.5)] = (this.section[yy].skyLight[(index/2 - 0.5)] & 0x0F) + (newSkyLight << 4);
        }
        ////////////////////////
        var newChunk = this.refreshLight(h);
        newChunk[4] = 1;
        if(z === 0) newChunk[3] = 1;
        if(z === 15) newChunk[5] = 1;
        if(x === 0) newChunk[1] = 1;
        if(x === 15) newChunk[7] = 1;
        //this.init2(0);
        //this.init2(1);

        var timeNow1 = new Date().getTime();
        var iChunk;
        for(var i = -1; i<=1; i++)
            for(var j = -1; j<=1; j++){
                if(newChunk[(i+1)*3+j+1] === 0) continue;
                iChunk = mcWorld.requestChunk(this.xPos+i, this.zPos+j);
                if(iChunk === undefined || iChunk === -1 || iChunk === -2 ) continue;
                iChunk.changed = true;
                iChunk.init2(0);
                iChunk.init2(1);
            }
        var timeNow3 = new Date().getTime();
        console.log("czas chunk "+(timeNow3-timeNow1));
    };  
    
Chunk.prototype.update = function(){
        if(this.isInit === -1)
            return;

        var newChunk = this.refreshLight(-1);
        newChunk[4] = 1;

        var timeNow1 = new Date().getTime();
        var iChunk;
        for(var i = -1; i<=1; i++)
            for(var j = -1; j<=1; j++){
                if(newChunk[(i+1)*3+j+1] === 0) continue;
                iChunk = mcWorld.requestChunk(this.xPos+i, this.zPos+j);
                if(iChunk === undefined || iChunk === -1 || iChunk === -2 ) continue;
                iChunk.changed = true;
                iChunk.init2(0);
                iChunk.init2(1);
            }
        this.needsUpdate = false;
        var timeNow3 = new Date().getTime();
        console.log("czas chunk "+(timeNow3-timeNow1));
    };  
    
Chunk.prototype.setBlock = function(x, h, z, id, data){
        if(this.isInit === -1)
            return;

        this.changed = true;

        var yy = Math.floor(h/16);
        var y = h - yy*16;
        var index = y*256+z*16+x;
        
        if(this.section[yy] === undefined) this.newSection(yy);
        this.section[yy].blocks[index] = id;
        
        var skyf = index % 2;
        if(skyf === 0){
            this.section[yy].data[(index/2)] = (this.section[yy].data[(index/2)] & 0xF0) + data;
            this.section[yy].add[(index/2)] = (this.section[yy].add[(index/2)] & 0xF0);
        }else{
            this.section[yy].data[(index/2 - 0.5)] = (this.section[yy].data[(index/2 - 0.5)] & 0x0F) + (data << 4);
            this.section[yy].add[(index/2 - 0.5)] = (this.section[yy].add[(index/2 - 0.5)] & 0x0F);
        }
        
        ////// sunlight
        var newSkyLight = 0;
        if(block[id].type === 0 || block[id].type === 2 || block[id].type === 3 || block[id].type === 4){
            newSkyLight = this.getSunLightValue(x,h+1,z);
            var blight = 0;
            for(var i = -1; i <= 1; i++)
                for(var j = -1; j<= 1; j++){
                    if((i !== 0) && (j !== 0)) continue;
                    if(x+i < 0)  continue;
                    if(x+i > 15)  continue;
                    if(z+j < 0)  continue;
                    if(z+j > 15)  continue;
                    blight = this.getSunLightValue(x+i,h,z+j);
                    if(blight - 1 > newSkyLight) newSkyLight = blight - 1;
                }
        }

        if(skyf === 0){
            this.section[yy].skyLight[(index/2)] = (this.section[yy].skyLight[(index/2)] & 0xF0) + newSkyLight;
        }else{
            this.section[yy].skyLight[(index/2 - 0.5)] = (this.section[yy].skyLight[(index/2 - 0.5)] & 0x0F) + (newSkyLight << 4);
        }
        ////////////////////////
        this.needsUpdate = true;
    };  
    
Chunk.prototype.getSunLightValue = function(x, y, z){
        var yy = Math.floor(y/16);
        y -= yy*16;
        if(this.section[yy] === undefined) this.newSection(yy);
        var index = y*256+z*16+x;
        var skyf = index % 2;
        if(yy<16){
            if(skyf === 0){
                return this.section[yy].skyLight[(index/2)] & 0x0F;
            }else{
                return (this.section[yy].skyLight[(index/2 - 0.5)] >> 4) & 0x0F;
            }
        }
        return 16;
};
    
Chunk.prototype.render = function(drawLevel, shader, level){
        //console.log("aaa");
        //var level = 0;
        if(!this.visible) return;
        if(level === 0 && this.isInit === -1)
            return;
        if(level === 1 && this.isInit1 === -1)
            return;
        if(level === 0 && this.isInit === 0){
            if(iLag > 1){
                iLag -= 1;
                if(!this.init2(0, true)) {
                    //iLag += 1;
                    return;
                }
            }
            else return;
        }
        if(level === 1 && this.isInit1 === 0){
            if(iLag > 1){
                iLag -= 1;
                if(!this.init2(1, true)) return;
            }
            else return;
        }
        

        gl.bindTexture(gl.TEXTURE_2D, blockTexture);

            //for(var i = 0; i < 16; i++){
            if(this.vbo[level] === undefined) return;
            if(this.vbo[level][drawLevel] === undefined) return;
               //gluu.mvPushMatrix();
               //mat4.translate(gluu.mvMatrix, gluu.mvMatrix, [0, 16 * i, 0]);
               //gl.uniformMatrix4fv(shader.mvMatrixUniform, false, gluu.mvMatrix);
               gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[level][drawLevel]);

               gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 9*4, 0 );
               gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 9*4, 3*4 );
               gl.vertexAttribPointer(shader.lightAttribute, 4, gl.FLOAT, false, 9*4, 5*4 );
       
               gl.drawArrays(gl.TRIANGLES, 0, this.ivbo[level][drawLevel]/9);

               //gluu.mvPopMatrix();
        //     }
    };
    
Chunk.prototype.deleteBuffers = function(){
        this.isInit = 0;
        this.isInit1 = 0;
        if(this.vbo !== undefined){
            if(this.vbo[0] !== undefined){
                this.vbo[0].forEach(function(e) {
                    gl.deleteBuffer(e);
                });
                this.ivbo[0].forEach(function(e) {
                    gpuMem -= e;
                    e = 0;
                });
            }

            if(this.vbo[1] !== undefined){
                this.vbo[1].forEach(function(e) {
                   gl.deleteBuffer(e);
                });
                this.ivbo[1].forEach(function(e) {
                    gpuMem -= e;
                    e = 0;
                });
            }
        }
    };