Chunk.prototype.getCache = function(yymin, yymax){
        var skyf = 0, index = 0, index2 = 0;
        //var timeNow1 = new Date().getTime();
        this.cacheBiomes = new Float32Array(18*18);
        this.cacheHeightMap = new Int32Array(18*18);

        var cacheSlight = Chunk.cacheSlight;
        var cacheBlight = Chunk.cacheBlight;
        var cacheData = Chunk.cacheData;
        var cacheId = Chunk.cacheId;
        var nietlchunk = false;
        var nietrchunk = false;
        var nietfchunk = false;
        var nietbchunk = false;
        
        var tbchunk = mcWorld.requestChunk(this.xPos+1, this.zPos);//rchunk[(this.xPos+1)*10000+this.zPos];
        if(tbchunk === undefined) nietbchunk = true;
        if(tbchunk === -1) nietbchunk = true;
        if(tbchunk === -2) return false;
        var tfchunk = mcWorld.requestChunk(this.xPos-1, this.zPos);//rchunk[(this.xPos-1)*10000+this.zPos];
        if(tfchunk === undefined) nietfchunk = true;
        if(tfchunk === -1) nietfchunk = true;
        if(tfchunk === -2) return false;
        var tlchunk = mcWorld.requestChunk(this.xPos, this.zPos+1);//rchunk[this.xPos*10000+(this.zPos+1)];
        if(tlchunk === undefined) nietlchunk = true;
        if(tlchunk === -1) nietlchunk = true;
        if(tlchunk === -2) return false;
        var trchunk = mcWorld.requestChunk(this.xPos, this.zPos-1);//rchunk[this.xPos*10000+(this.zPos-1)];
        if(trchunk === undefined) nietrchunk = true;
        if(trchunk === -1) nietrchunk = true;
        if(trchunk === -2) return false;
                   

        // gora i dol
        for(var z = 0; z < 16; z++)
            for(var x = 0; x < 16; x++){
                index2 = (0)*324 + (z+1)*18 + (x+1);
                cacheId[index2] = 1;
                cacheSlight[index2] = 0;
                cacheBlight[index2] = 0;
                index2 = (257)*324 + (z+1)*18 + (x+1);
                cacheId[index2] = 0;
                cacheSlight[index2] = 15;
                cacheBlight[index2] = 0;
            }
        
        var yymin2 = yymin - 1; if(yymin2 < 0) yymin2 = 0;
        var yymax2 = yymax + 1; if(yymax2 > 256) yymax2 = 256;
        
        //fill
        for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
           for(var x = 0; x < 18; x++){
               index2 = (i+1)*324 + (0)*18 + (x);
               cacheId[index2] = 1;
               index2 = (i+1)*324 + (17)*18 + (x);
               cacheId[index2] = 1;
           }
           for(var z = 0; z < 18; z++){
               index2 = (i+1)*324 + (z)*18 + (0);
               cacheId[index2] = 1;
               index2 = (i+1)*324 + (z)*18 + (17);
               cacheId[index2] = 1;
           }
        }
        
        for(var y = 0; y < 16; y++ )
            for(var z = 0; z < 16; z++){
                this.cacheBiomes[(y+1)*18 + z + 1] = this.biomes[(y)*16 + z];
                this.cacheHeightMap[(y+1)*18 + z + 1] = this.heightMap[(y)*16 + z];
            }
        for(var y = 0; y < 16; y++ ){
           this.cacheBiomes[(y+1)*18 + 0] = this.cacheBiomes[(y+1)*18 + 1];
           this.cacheHeightMap[(y+1)*18 + 0] = this.cacheHeightMap[(y+1)*18 + 1];
           this.cacheBiomes[(y+1)*18 + 17] = this.cacheBiomes[(y+1)*18 + 16];
           this.cacheHeightMap[(y+1)*18 + 17] = this.cacheHeightMap[(y+1)*18 + 16];
           this.cacheBiomes[17*18 + (y + 1)] = this.cacheBiomes[16*18 + (y + 1)];
           this.cacheHeightMap[17*18 + (y + 1)] = this.cacheHeightMap[16*18 + (y + 1)];
           this.cacheBiomes[0 + (y + 1)] = this.cacheBiomes[18 + (y + 1)];
           this.cacheHeightMap[0 + (y + 1)] = this.cacheHeightMap[18 + (y + 1)];
        }
        
        //left
        if(!nietlchunk){
            for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
                if(i%16 === 0){
                    var asection = tlchunk.section[i/16];
                    y = 0;
                    if(asection === undefined){
                        for(var ii = i; ii<i+15; ii++)
                           for(var x = 0; x < 16; x++){
                               index2 = (ii+1)*324 + 17*18 + (x+1);
                               cacheId[index2] = 0;
                               cacheSlight[index2] = 15;
                               cacheBlight[index2] = 0;
                           }
                        i+=15;
                        y = -1;
                        continue;
                    }
                }

                for(var x = 0; x < 16; x++){
                    index = y*256+0*16+x;
                    index2 = (i+1)*324 + 17*18 + (x+1);
                    cacheId[index2] = asection.blocks[index];
                    skyf = index % 2;
                    cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
                }
            }
            for(var y = 0; y < 16; y++ ){
                this.cacheBiomes[17*18 + (y + 1)] = tlchunk.biomes[0 + (y)];
                this.cacheHeightMap[17*18 + (y + 1)] = tlchunk.heightMap[0 + (y)];
            }
        }

        //right
        if(!nietrchunk){
            for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
                if(i%16 === 0){
                    var asection = trchunk.section[i/16];
                    y = 0;
                    if(asection === undefined){
                        for(var ii = i; ii<i+15; ii++)
                           for(var x = 0; x < 16; x++){
                               index2 = (ii+1)*324 + 0*18 + (x+1);
                               cacheId[index2] = 0;
                               cacheSlight[index2] = 15;
                               cacheBlight[index2] = 0;
                            }
                        i+=15;
                        y = -1;
                        continue;
                    }
                }

                for(var x = 0; x < 16; x++){
                    index = y*256+15*16+x;
                    index2 = (i+1)*324 + 0*18 + (x+1);
                    cacheId[index2] = asection.blocks[index];
                    skyf = index % 2;
                    cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
                }
            }
            for(var y = 0; y < 16; y++ ){
                this.cacheBiomes[0 + (y + 1)] = trchunk.biomes[15*16 + (y)];
                this.cacheHeightMap[0 + (y + 1)] = trchunk.heightMap[15*16 + (y)];
            }
        }


        //front
        if(!nietfchunk){
            for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
                if(i%16 === 0){
                    var asection = tfchunk.section[i/16];
                    y = 0;
                    if(asection === undefined){
                        for(var ii = i; ii<i+15; ii++)
                           for(var z = 0; z < 16; z++){
                               index2 = (ii+1)*324 + (z+1)*18 + 0;
                               cacheId[index2] = 0;
                               cacheSlight[index2] = 15;
                               cacheBlight[index2] = 0;
                            }
                        i+=15;
                        y = -1;
                        continue;
                    }
                }

                for(var z = 0; z < 16; z++){
                    index = y*256+z*16+15;
                    index2 = (i+1)*324 + (z+1)*18 + 0;
                    cacheId[index2] = asection.blocks[index];
                    skyf = index % 2;
                    cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
                }
            }
            for(var y = 0; y < 16; y++ ){
                this.cacheBiomes[(y+1)*18 + 0] = tfchunk.biomes[y*16 + 15];
                this.cacheHeightMap[(y+1)*18 + 0] = tfchunk.heightMap[y*16 + 15];
            }
        }


        //back
        if(!nietbchunk){
            for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
                if(i%16 === 0){
                    var asection = tbchunk.section[i/16];
                    y = 0;
                    if(asection === undefined){
                        for(var ii = i; ii<i+15; ii++)
                           for(var z = 0; z < 16; z++){
                               index2 = (ii+1)*324 + (z+1)*18 + 17;
                               cacheId[index2] = 0;
                               cacheSlight[index2] = 15;
                               cacheBlight[index2] = 0;
                            }
                        i+=15;
                        y = -1;
                        continue;
                    }
                }

                for(var z = 0; z < 16; z++){
                    index = y*256+z*16+0;
                    index2 = (i+1)*324 + (z+1)*18 + 17;
                    cacheId[index2] = asection.blocks[index];
                    skyf = index % 2;
                    cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
                }
            }
            for(var y = 0; y < 16; y++ ){
                this.cacheBiomes[(y+1)*18 + 17] = tbchunk.biomes[y*16 + 0];
                this.cacheHeightMap[(y+1)*18 + 17] = tbchunk.heightMap[y*16 + 0];
            }
        }
        
        // bloczki tego chunka
        for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
           if(i%16 === 0){
               var asection = this.section[i/16];
               y = 0;
               if(asection === undefined){
                   for(var z = 0; z < 16; z++)
                       for(var x = 0; x < 16; x++){
                           index2 = (i+1)*324 + (z+1)*18 + (x+1);
                           cacheId[index2] = 0;
                           cacheSlight[index2] = 15;
                           cacheBlight[index2] = 0;
                           index2 = (i+16)*324 + (z+1)*18 + (x+1);
                           cacheId[index2] = 0;
                           cacheSlight[index2] = 15;
                           cacheBlight[index2] = 0;
                        }
                   cacheId[(i+2)*324 + 19] = -1;
                   i+=15;
                   y = -1;
                   continue;
               }
           }

           for(var z = 0; z < 16; z++){
               for(var x = 0; x < 16; x++){
                   index = y*256+z*16+x;
                   index2 = (i+1)*324 + (z+1)*18 + (x+1);
                   cacheId[index2] = asection.blocks[index];
                   skyf = index % 2;
                   cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                   cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                   cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
               }
           }
        }
        //fill corners
        for(var i = yymin2; i < yymax2; i++){
               cacheSlight[(i+1)*324 + (0)*18 + 0] = Math.floor((cacheSlight[(i+1)*324 + (1)*18 + 0] + cacheSlight[(i+1)*324 + (0)*18 + 1])/2);
               cacheSlight[(i+1)*324 + (17)*18 + 0] = Math.floor((cacheSlight[(i+1)*324 + (16)*18 + 0] + cacheSlight[(i+1)*324 + (17)*18 + 1])/2);
               cacheSlight[(i+1)*324 + (0)*18 + 17] = Math.floor((cacheSlight[(i+1)*324 + (1)*18 + 17] + cacheSlight[(i+1)*324 + (0)*18 + 16])/2);
               cacheSlight[(i+1)*324 + (17)*18 + 17] = Math.floor((cacheSlight[(i+1)*324 + (16)*18 + 17] + cacheSlight[(i+1)*324 + (17)*18 + 16])/2);
               cacheBlight[(i+1)*324 + (0)*18 + 0] = Math.floor((cacheBlight[(i+1)*324 + (1)*18 + 0] + cacheBlight[(i+1)*324 + (0)*18 + 1])/2);
               cacheBlight[(i+1)*324 + (17)*18 + 0] = Math.floor((cacheBlight[(i+1)*324 + (16)*18 + 0] + cacheBlight[(i+1)*324 + (17)*18 + 1])/2);
               cacheBlight[(i+1)*324 + (0)*18 + 17] = Math.floor((cacheBlight[(i+1)*324 + (1)*18 + 17] + cacheBlight[(i+1)*324 + (0)*18 + 16])/2);
               cacheBlight[(i+1)*324 + (17)*18 + 17] = Math.floor((cacheBlight[(i+1)*324 + (16)*18 + 17] + cacheBlight[(i+1)*324 + (17)*18 + 16])/2);
            }
        return true;
    };
    

Chunk.prototype.getCache = function(yymin, yymax){
        var skyf = 0, index = 0, index2 = 0;
        //var timeNow1 = new Date().getTime();
        this.cacheBiomes = new Float32Array(18*18);
        this.cacheHeightMap = new Int32Array(18*18);

        var cacheSlight = Chunk.cacheSlight;
        var cacheBlight = Chunk.cacheBlight;
        var cacheData = Chunk.cacheData;
        var cacheId = Chunk.cacheId;
        var nietlchunk = false;
        var nietrchunk = false;
        var nietfchunk = false;
        var nietbchunk = false;
        
        var tbchunk = mcWorld.requestChunk(this.xPos+1, this.zPos);//rchunk[(this.xPos+1)*10000+this.zPos];
        if(tbchunk === undefined) nietbchunk = true;
        if(tbchunk === -1) nietbchunk = true;
        if(tbchunk === -2) return false;
        var tfchunk = mcWorld.requestChunk(this.xPos-1, this.zPos);//rchunk[(this.xPos-1)*10000+this.zPos];
        if(tfchunk === undefined) nietfchunk = true;
        if(tfchunk === -1) nietfchunk = true;
        if(tfchunk === -2) return false;
        var tlchunk = mcWorld.requestChunk(this.xPos, this.zPos+1);//rchunk[this.xPos*10000+(this.zPos+1)];
        if(tlchunk === undefined) nietlchunk = true;
        if(tlchunk === -1) nietlchunk = true;
        if(tlchunk === -2) return false;
        var trchunk = mcWorld.requestChunk(this.xPos, this.zPos-1);//rchunk[this.xPos*10000+(this.zPos-1)];
        if(trchunk === undefined) nietrchunk = true;
        if(trchunk === -1) nietrchunk = true;
        if(trchunk === -2) return false;
                   

        // gora i dol
        for(var z = 0; z < 16; z++)
            for(var x = 0; x < 16; x++){
                index2 = (0)*324 + (z+1)*18 + (x+1);
                cacheId[index2] = 1;
                cacheSlight[index2] = 0;
                cacheBlight[index2] = 0;
                index2 = (257)*324 + (z+1)*18 + (x+1);
                cacheId[index2] = 0;
                cacheSlight[index2] = 15;
                cacheBlight[index2] = 0;
            }
        
        var yymin2 = yymin - 1; if(yymin2 < 0) yymin2 = 0;
        var yymax2 = yymax + 1; if(yymax2 > 256) yymax2 = 256;
        
        //fill
        for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
           for(var x = 0; x < 18; x++){
               index2 = (i+1)*324 + (0)*18 + (x);
               cacheId[index2] = 1;
               index2 = (i+1)*324 + (17)*18 + (x);
               cacheId[index2] = 1;
           }
           for(var z = 0; z < 18; z++){
               index2 = (i+1)*324 + (z)*18 + (0);
               cacheId[index2] = 1;
               index2 = (i+1)*324 + (z)*18 + (17);
               cacheId[index2] = 1;
           }
        }
        
        for(var y = 0; y < 16; y++ )
            for(var z = 0; z < 16; z++){
                this.cacheBiomes[(y+1)*18 + z + 1] = this.biomes[(y)*16 + z];
                this.cacheHeightMap[(y+1)*18 + z + 1] = this.heightMap[(y)*16 + z];
            }
        for(var y = 0; y < 16; y++ ){
           this.cacheBiomes[(y+1)*18 + 0] = this.cacheBiomes[(y+1)*18 + 1];
           this.cacheHeightMap[(y+1)*18 + 0] = this.cacheHeightMap[(y+1)*18 + 1];
           this.cacheBiomes[(y+1)*18 + 17] = this.cacheBiomes[(y+1)*18 + 16];
           this.cacheHeightMap[(y+1)*18 + 17] = this.cacheHeightMap[(y+1)*18 + 16];
           this.cacheBiomes[17*18 + (y + 1)] = this.cacheBiomes[16*18 + (y + 1)];
           this.cacheHeightMap[17*18 + (y + 1)] = this.cacheHeightMap[16*18 + (y + 1)];
           this.cacheBiomes[0 + (y + 1)] = this.cacheBiomes[18 + (y + 1)];
           this.cacheHeightMap[0 + (y + 1)] = this.cacheHeightMap[18 + (y + 1)];
        }
        
        //left
        if(!nietlchunk){
            for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
                if(i%16 === 0){
                    var asection = tlchunk.section[i/16];
                    y = 0;
                    if(asection === undefined){
                        for(var ii = i; ii<i+15; ii++)
                           for(var x = 0; x < 16; x++){
                               index2 = (ii+1)*324 + 17*18 + (x+1);
                               cacheId[index2] = 0;
                               cacheSlight[index2] = 15;
                               cacheBlight[index2] = 0;
                           }
                        i+=15;
                        y = -1;
                        continue;
                    }
                }

                for(var x = 0; x < 16; x++){
                    index = y*256+0*16+x;
                    index2 = (i+1)*324 + 17*18 + (x+1);
                    cacheId[index2] = asection.blocks[index];
                    skyf = index % 2;
                    cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
                }
            }
            for(var y = 0; y < 16; y++ ){
                this.cacheBiomes[17*18 + (y + 1)] = tlchunk.biomes[0 + (y)];
                this.cacheHeightMap[17*18 + (y + 1)] = tlchunk.heightMap[0 + (y)];
            }
        }

        //right
        if(!nietrchunk){
            for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
                if(i%16 === 0){
                    var asection = trchunk.section[i/16];
                    y = 0;
                    if(asection === undefined){
                        for(var ii = i; ii<i+15; ii++)
                           for(var x = 0; x < 16; x++){
                               index2 = (ii+1)*324 + 0*18 + (x+1);
                               cacheId[index2] = 0;
                               cacheSlight[index2] = 15;
                               cacheBlight[index2] = 0;
                            }
                        i+=15;
                        y = -1;
                        continue;
                    }
                }

                for(var x = 0; x < 16; x++){
                    index = y*256+15*16+x;
                    index2 = (i+1)*324 + 0*18 + (x+1);
                    cacheId[index2] = asection.blocks[index];
                    skyf = index % 2;
                    cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
                }
            }
            for(var y = 0; y < 16; y++ ){
                this.cacheBiomes[0 + (y + 1)] = trchunk.biomes[15*16 + (y)];
                this.cacheHeightMap[0 + (y + 1)] = trchunk.heightMap[15*16 + (y)];
            }
        }


        //front
        if(!nietfchunk){
            for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
                if(i%16 === 0){
                    var asection = tfchunk.section[i/16];
                    y = 0;
                    if(asection === undefined){
                        for(var ii = i; ii<i+15; ii++)
                           for(var z = 0; z < 16; z++){
                               index2 = (ii+1)*324 + (z+1)*18 + 0;
                               cacheId[index2] = 0;
                               cacheSlight[index2] = 15;
                               cacheBlight[index2] = 0;
                            }
                        i+=15;
                        y = -1;
                        continue;
                    }
                }

                for(var z = 0; z < 16; z++){
                    index = y*256+z*16+15;
                    index2 = (i+1)*324 + (z+1)*18 + 0;
                    cacheId[index2] = asection.blocks[index];
                    skyf = index % 2;
                    cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
                }
            }
            for(var y = 0; y < 16; y++ ){
                this.cacheBiomes[(y+1)*18 + 0] = tfchunk.biomes[y*16 + 15];
                this.cacheHeightMap[(y+1)*18 + 0] = tfchunk.heightMap[y*16 + 15];
            }
        }


        //back
        if(!nietbchunk){
            for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
                if(i%16 === 0){
                    var asection = tbchunk.section[i/16];
                    y = 0;
                    if(asection === undefined){
                        for(var ii = i; ii<i+15; ii++)
                           for(var z = 0; z < 16; z++){
                               index2 = (ii+1)*324 + (z+1)*18 + 17;
                               cacheId[index2] = 0;
                               cacheSlight[index2] = 15;
                               cacheBlight[index2] = 0;
                            }
                        i+=15;
                        y = -1;
                        continue;
                    }
                }

                for(var z = 0; z < 16; z++){
                    index = y*256+z*16+0;
                    index2 = (i+1)*324 + (z+1)*18 + 17;
                    cacheId[index2] = asection.blocks[index];
                    skyf = index % 2;
                    cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
                }
            }
            for(var y = 0; y < 16; y++ ){
                this.cacheBiomes[(y+1)*18 + 17] = tbchunk.biomes[y*16 + 0];
                this.cacheHeightMap[(y+1)*18 + 17] = tbchunk.heightMap[y*16 + 0];
            }
        }
        
        // bloczki tego chunka
        for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
           if(i%16 === 0){
               var asection = this.section[i/16];
               y = 0;
               if(asection === undefined){
                   for(var z = 0; z < 16; z++)
                       for(var x = 0; x < 16; x++){
                           index2 = (i+1)*324 + (z+1)*18 + (x+1);
                           cacheId[index2] = 0;
                           cacheSlight[index2] = 15;
                           cacheBlight[index2] = 0;
                           index2 = (i+16)*324 + (z+1)*18 + (x+1);
                           cacheId[index2] = 0;
                           cacheSlight[index2] = 15;
                           cacheBlight[index2] = 0;
                        }
                   cacheId[(i+2)*324 + 19] = -1;
                   i+=15;
                   y = -1;
                   continue;
               }
           }

           for(var z = 0; z < 16; z++){
               for(var x = 0; x < 16; x++){
                   index = y*256+z*16+x;
                   index2 = (i+1)*324 + (z+1)*18 + (x+1);
                   cacheId[index2] = asection.blocks[index];
                   skyf = index % 2;
                   cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                   cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                   cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
               }
           }
        }
        //fill corners
        for(var i = yymin2; i < yymax2; i++){
               cacheSlight[(i+1)*324 + (0)*18 + 0] = Math.floor((cacheSlight[(i+1)*324 + (1)*18 + 0] + cacheSlight[(i+1)*324 + (0)*18 + 1])/2);
               cacheSlight[(i+1)*324 + (17)*18 + 0] = Math.floor((cacheSlight[(i+1)*324 + (16)*18 + 0] + cacheSlight[(i+1)*324 + (17)*18 + 1])/2);
               cacheSlight[(i+1)*324 + (0)*18 + 17] = Math.floor((cacheSlight[(i+1)*324 + (1)*18 + 17] + cacheSlight[(i+1)*324 + (0)*18 + 16])/2);
               cacheSlight[(i+1)*324 + (17)*18 + 17] = Math.floor((cacheSlight[(i+1)*324 + (16)*18 + 17] + cacheSlight[(i+1)*324 + (17)*18 + 16])/2);
               cacheBlight[(i+1)*324 + (0)*18 + 0] = Math.floor((cacheBlight[(i+1)*324 + (1)*18 + 0] + cacheBlight[(i+1)*324 + (0)*18 + 1])/2);
               cacheBlight[(i+1)*324 + (17)*18 + 0] = Math.floor((cacheBlight[(i+1)*324 + (16)*18 + 0] + cacheBlight[(i+1)*324 + (17)*18 + 1])/2);
               cacheBlight[(i+1)*324 + (0)*18 + 17] = Math.floor((cacheBlight[(i+1)*324 + (1)*18 + 17] + cacheBlight[(i+1)*324 + (0)*18 + 16])/2);
               cacheBlight[(i+1)*324 + (17)*18 + 17] = Math.floor((cacheBlight[(i+1)*324 + (16)*18 + 17] + cacheBlight[(i+1)*324 + (17)*18 + 16])/2);
            }
        return true;
    };
    
Chunk.prototype.getCache = function(yymin, yymax){
        var skyf = 0, index = 0, index2 = 0;
        //var timeNow1 = new Date().getTime();
        this.cacheBiomes = new Float32Array(18*18);
        this.cacheHeightMap = new Int32Array(18*18);

        var cacheSlight = Chunk.cacheSlight;
        var cacheBlight = Chunk.cacheBlight;
        var cacheData = Chunk.cacheData;
        var cacheId = Chunk.cacheId;
        var nietlchunk = false;
        var nietrchunk = false;
        var nietfchunk = false;
        var nietbchunk = false;
        
        var tbchunk = mcWorld.requestChunk(this.xPos+1, this.zPos);//rchunk[(this.xPos+1)*10000+this.zPos];
        if(tbchunk === undefined) nietbchunk = true;
        if(tbchunk === -1) nietbchunk = true;
        if(tbchunk === -2) return false;
        var tfchunk = mcWorld.requestChunk(this.xPos-1, this.zPos);//rchunk[(this.xPos-1)*10000+this.zPos];
        if(tfchunk === undefined) nietfchunk = true;
        if(tfchunk === -1) nietfchunk = true;
        if(tfchunk === -2) return false;
        var tlchunk = mcWorld.requestChunk(this.xPos, this.zPos+1);//rchunk[this.xPos*10000+(this.zPos+1)];
        if(tlchunk === undefined) nietlchunk = true;
        if(tlchunk === -1) nietlchunk = true;
        if(tlchunk === -2) return false;
        var trchunk = mcWorld.requestChunk(this.xPos, this.zPos-1);//rchunk[this.xPos*10000+(this.zPos-1)];
        if(trchunk === undefined) nietrchunk = true;
        if(trchunk === -1) nietrchunk = true;
        if(trchunk === -2) return false;
                   

        // gora i dol
        for(var z = 0; z < 16; z++)
            for(var x = 0; x < 16; x++){
                index2 = (0)*324 + (z+1)*18 + (x+1);
                cacheId[index2] = 1;
                cacheSlight[index2] = 0;
                cacheBlight[index2] = 0;
                index2 = (257)*324 + (z+1)*18 + (x+1);
                cacheId[index2] = 0;
                cacheSlight[index2] = 15;
                cacheBlight[index2] = 0;
            }
        
        var yymin2 = yymin - 1; if(yymin2 < 0) yymin2 = 0;
        var yymax2 = yymax + 1; if(yymax2 > 256) yymax2 = 256;
        
        //fill
        for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
           for(var x = 0; x < 18; x++){
               index2 = (i+1)*324 + (0)*18 + (x);
               cacheId[index2] = 1;
               index2 = (i+1)*324 + (17)*18 + (x);
               cacheId[index2] = 1;
           }
           for(var z = 0; z < 18; z++){
               index2 = (i+1)*324 + (z)*18 + (0);
               cacheId[index2] = 1;
               index2 = (i+1)*324 + (z)*18 + (17);
               cacheId[index2] = 1;
           }
        }
        
        for(var y = 0; y < 16; y++ )
            for(var z = 0; z < 16; z++){
                this.cacheBiomes[(y+1)*18 + z + 1] = this.biomes[(y)*16 + z];
                this.cacheHeightMap[(y+1)*18 + z + 1] = this.heightMap[(y)*16 + z];
            }
        for(var y = 0; y < 16; y++ ){
           this.cacheBiomes[(y+1)*18 + 0] = this.cacheBiomes[(y+1)*18 + 1];
           this.cacheHeightMap[(y+1)*18 + 0] = this.cacheHeightMap[(y+1)*18 + 1];
           this.cacheBiomes[(y+1)*18 + 17] = this.cacheBiomes[(y+1)*18 + 16];
           this.cacheHeightMap[(y+1)*18 + 17] = this.cacheHeightMap[(y+1)*18 + 16];
           this.cacheBiomes[17*18 + (y + 1)] = this.cacheBiomes[16*18 + (y + 1)];
           this.cacheHeightMap[17*18 + (y + 1)] = this.cacheHeightMap[16*18 + (y + 1)];
           this.cacheBiomes[0 + (y + 1)] = this.cacheBiomes[18 + (y + 1)];
           this.cacheHeightMap[0 + (y + 1)] = this.cacheHeightMap[18 + (y + 1)];
        }
        
        //left
        if(!nietlchunk){
            for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
                if(i%16 === 0){
                    var asection = tlchunk.section[i/16];
                    y = 0;
                    if(asection === undefined){
                        for(var ii = i; ii<i+15; ii++)
                           for(var x = 0; x < 16; x++){
                               index2 = (ii+1)*324 + 17*18 + (x+1);
                               cacheId[index2] = 0;
                               cacheSlight[index2] = 15;
                               cacheBlight[index2] = 0;
                           }
                        i+=15;
                        y = -1;
                        continue;
                    }
                }

                for(var x = 0; x < 16; x++){
                    index = y*256+0*16+x;
                    index2 = (i+1)*324 + 17*18 + (x+1);
                    cacheId[index2] = asection.blocks[index];
                    skyf = index % 2;
                    cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
                }
            }
            for(var y = 0; y < 16; y++ ){
                this.cacheBiomes[17*18 + (y + 1)] = tlchunk.biomes[0 + (y)];
                this.cacheHeightMap[17*18 + (y + 1)] = tlchunk.heightMap[0 + (y)];
            }
        }

        //right
        if(!nietrchunk){
            for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
                if(i%16 === 0){
                    var asection = trchunk.section[i/16];
                    y = 0;
                    if(asection === undefined){
                        for(var ii = i; ii<i+15; ii++)
                           for(var x = 0; x < 16; x++){
                               index2 = (ii+1)*324 + 0*18 + (x+1);
                               cacheId[index2] = 0;
                               cacheSlight[index2] = 15;
                               cacheBlight[index2] = 0;
                            }
                        i+=15;
                        y = -1;
                        continue;
                    }
                }

                for(var x = 0; x < 16; x++){
                    index = y*256+15*16+x;
                    index2 = (i+1)*324 + 0*18 + (x+1);
                    cacheId[index2] = asection.blocks[index];
                    skyf = index % 2;
                    cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
                }
            }
            for(var y = 0; y < 16; y++ ){
                this.cacheBiomes[0 + (y + 1)] = trchunk.biomes[15*16 + (y)];
                this.cacheHeightMap[0 + (y + 1)] = trchunk.heightMap[15*16 + (y)];
            }
        }


        //front
        if(!nietfchunk){
            for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
                if(i%16 === 0){
                    var asection = tfchunk.section[i/16];
                    y = 0;
                    if(asection === undefined){
                        for(var ii = i; ii<i+15; ii++)
                           for(var z = 0; z < 16; z++){
                               index2 = (ii+1)*324 + (z+1)*18 + 0;
                               cacheId[index2] = 0;
                               cacheSlight[index2] = 15;
                               cacheBlight[index2] = 0;
                            }
                        i+=15;
                        y = -1;
                        continue;
                    }
                }

                for(var z = 0; z < 16; z++){
                    index = y*256+z*16+15;
                    index2 = (i+1)*324 + (z+1)*18 + 0;
                    cacheId[index2] = asection.blocks[index];
                    skyf = index % 2;
                    cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
                }
            }
            for(var y = 0; y < 16; y++ ){
                this.cacheBiomes[(y+1)*18 + 0] = tfchunk.biomes[y*16 + 15];
                this.cacheHeightMap[(y+1)*18 + 0] = tfchunk.heightMap[y*16 + 15];
            }
        }


        //back
        if(!nietbchunk){
            for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
                if(i%16 === 0){
                    var asection = tbchunk.section[i/16];
                    y = 0;
                    if(asection === undefined){
                        for(var ii = i; ii<i+15; ii++)
                           for(var z = 0; z < 16; z++){
                               index2 = (ii+1)*324 + (z+1)*18 + 17;
                               cacheId[index2] = 0;
                               cacheSlight[index2] = 15;
                               cacheBlight[index2] = 0;
                            }
                        i+=15;
                        y = -1;
                        continue;
                    }
                }

                for(var z = 0; z < 16; z++){
                    index = y*256+z*16+0;
                    index2 = (i+1)*324 + (z+1)*18 + 17;
                    cacheId[index2] = asection.blocks[index];
                    skyf = index % 2;
                    cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                    cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
                }
            }
            for(var y = 0; y < 16; y++ ){
                this.cacheBiomes[(y+1)*18 + 17] = tbchunk.biomes[y*16 + 0];
                this.cacheHeightMap[(y+1)*18 + 17] = tbchunk.heightMap[y*16 + 0];
            }
        }
        
        // bloczki tego chunka
        for(var i = yymin2, y = 0; i < yymax2; i++, y++ ){
           if(i%16 === 0){
               var asection = this.section[i/16];
               y = 0;
               if(asection === undefined){
                   for(var z = 0; z < 16; z++)
                       for(var x = 0; x < 16; x++){
                           index2 = (i+1)*324 + (z+1)*18 + (x+1);
                           cacheId[index2] = 0;
                           cacheSlight[index2] = 15;
                           cacheBlight[index2] = 0;
                           index2 = (i+16)*324 + (z+1)*18 + (x+1);
                           cacheId[index2] = 0;
                           cacheSlight[index2] = 15;
                           cacheBlight[index2] = 0;
                        }
                   cacheId[(i+2)*324 + 19] = -1;
                   i+=15;
                   y = -1;
                   continue;
               }
           }

           for(var z = 0; z < 16; z++){
               for(var x = 0; x < 16; x++){
                   index = y*256+z*16+x;
                   index2 = (i+1)*324 + (z+1)*18 + (x+1);
                   cacheId[index2] = asection.blocks[index];
                   skyf = index % 2;
                   cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                   cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                   cacheData[index2] = ((asection.data[(index/2 - skyf/2)] >> skyf*4) & 0x0F) & block[asection.blocks[index]].mask;
               }
           }
        }
        //fill corners
        for(var i = yymin2; i < yymax2; i++){
               cacheSlight[(i+1)*324 + (0)*18 + 0] = Math.floor((cacheSlight[(i+1)*324 + (1)*18 + 0] + cacheSlight[(i+1)*324 + (0)*18 + 1])/2);
               cacheSlight[(i+1)*324 + (17)*18 + 0] = Math.floor((cacheSlight[(i+1)*324 + (16)*18 + 0] + cacheSlight[(i+1)*324 + (17)*18 + 1])/2);
               cacheSlight[(i+1)*324 + (0)*18 + 17] = Math.floor((cacheSlight[(i+1)*324 + (1)*18 + 17] + cacheSlight[(i+1)*324 + (0)*18 + 16])/2);
               cacheSlight[(i+1)*324 + (17)*18 + 17] = Math.floor((cacheSlight[(i+1)*324 + (16)*18 + 17] + cacheSlight[(i+1)*324 + (17)*18 + 16])/2);
               cacheBlight[(i+1)*324 + (0)*18 + 0] = Math.floor((cacheBlight[(i+1)*324 + (1)*18 + 0] + cacheBlight[(i+1)*324 + (0)*18 + 1])/2);
               cacheBlight[(i+1)*324 + (17)*18 + 0] = Math.floor((cacheBlight[(i+1)*324 + (16)*18 + 0] + cacheBlight[(i+1)*324 + (17)*18 + 1])/2);
               cacheBlight[(i+1)*324 + (0)*18 + 17] = Math.floor((cacheBlight[(i+1)*324 + (1)*18 + 17] + cacheBlight[(i+1)*324 + (0)*18 + 16])/2);
               cacheBlight[(i+1)*324 + (17)*18 + 17] = Math.floor((cacheBlight[(i+1)*324 + (16)*18 + 17] + cacheBlight[(i+1)*324 + (17)*18 + 16])/2);
            }
        return true;
    };
    

Chunk.prototype.getCacheL9 = function(){
        var skyf = 0, index = 0, index2 = 0;

        var cacheSlight = Chunk.cacheSlight9;
        var cacheBlight = Chunk.cacheBlight9;
        var cacheId = Chunk.cacheId9;
        
        var chunk = new Array();
        for(var i = -1; i<=1; i++)
            for(var j = -1; j<=1; j++){
                chunk[(i+1)*3+j+1] = mcWorld.requestChunk(this.xPos+i, this.zPos+j);
                if(chunk[(i+1)*3+j+1] === -2) return false;
            }
                  

        // gora i dol
        for(var z = 0; z < 48; z++)
            for(var x = 0; x < 48; x++){
                index2 = (z)*48 + (x);
                cacheId[index2] = 1;
                cacheSlight[index2] = 0;
                cacheBlight[index2] = 0;
                index2 = (257)*2304 + (z)*48 + (x);
                cacheId[index2] = 0;
                cacheSlight[index2] = 15;
                cacheBlight[index2] = 0;
            }
        
        //chunki
        var iChunk;
        for(var iCh = 0; iCh<=2; iCh++)
            for(var jCh = 0; jCh<=2; jCh++){
                iChunk = chunk[(iCh)*3+jCh];
                if(iChunk === undefined || iChunk === -1)
                    continue;
                // heightmap
                for(var z = 0; z < 16; z++){
                    for(var x = 0; x < 16; x++){
                        Chunk.cacheHeightMap9[(jCh*16+z)*48 + iCh*16+x] = iChunk.heightMap[z*16+x];
                    }
                }
                // bloczki tego chunka
                for(var i = 0, y = 0; i < 256; i++, y++ ){
                   if(i%16 === 0){
                       var asection = iChunk.section[i/16];
                       y = 0;
                       if(asection === undefined){
                           for(var z = 0; z < 16; z++)
                               for(var x = 0; x < 16; x++){
                                   index2 = (i)*2304 + (jCh*16+z)*48 + (iCh*16+x);
                                   cacheId[index2] = 0;
                                   cacheSlight[index2] = 0;
                                   cacheBlight[index2] = 0;
                                   index2 = (i+15)*2304 + (jCh*16+z)*48 + (iCh*16+x);
                                   cacheId[index2] = 0;
                                   cacheSlight[index2] = 0;
                                   cacheBlight[index2] = 0;
                                }
                           i+=15;
                           y = -1;
                           continue;
                       }
                   }

                   for(var z = 0; z < 16; z++){
                       for(var x = 0; x < 16; x++){
                           index = y*256+z*16+x;
                           index2 = (i)*2304 + (jCh*16+z)*48 + (iCh*16+x);
                           cacheId[index2] = asection.blocks[index];
                           skyf = index % 2;
                           cacheSlight[index2] = (asection.skyLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                           cacheBlight[index2] = (asection.blockLight[(index/2 - skyf/2)] >> skyf*4) & 0x0F;
                       }
                   }
                }
            }
        return true;
    };
    