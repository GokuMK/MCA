Chunk.prototype.init2 = function(yyyy){
        var skyf = 0, index = 0, index2 = 0;
        //var timeNow1 = new Date().getTime();
        this.cacheBiomes = new Float32Array(18*18);
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
                   
        if(yyyy === 0){ 
            this.isInit = -1;
            var yymin = 49;
            var yymax = 256;
        } else {
            this.isInit1 = -1;
            yymin = 0; 
            yymax = 49;
        }

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
            for(var z = 0; z < 16; z++)
                this.cacheBiomes[(y+1)*18 + z + 1] = this.biomes[(y)*16 + z];
        for(var y = 0; y < 16; y++ ){
           this.cacheBiomes[(y+1)*18 + 0] = this.cacheBiomes[(y+1)*18 + 1];
           this.cacheBiomes[(y+1)*18 + 17] = this.cacheBiomes[(y+1)*18 + 16];
           this.cacheBiomes[17*18 + (y + 1)] = this.cacheBiomes[16*18 + (y + 1)];
           this.cacheBiomes[0 + (y + 1)] = this.cacheBiomes[18 + (y + 1)];
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
            for(var y = 0; y < 16; y++ )
                this.cacheBiomes[17*18 + (y + 1)] = tlchunk.biomes[0 + (y)];
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
            for(var y = 0; y < 16; y++ )
                this.cacheBiomes[0 + (y + 1)] = trchunk.biomes[15*16 + (y)];
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
            for(var y = 0; y < 16; y++ )
                this.cacheBiomes[(y+1)*18 + 0] = tfchunk.biomes[y*16 + 15];
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
            for(var y = 0; y < 16; y++ )
                this.cacheBiomes[(y+1)*18 + 17] = tbchunk.biomes[y*16 + 0];
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
        ///////////////////////////////////
        ///////////////////////////////////
        ///////////////////////////////////
        var skyf = 0, index = 0, index2 = 0;
        var drawLevel = 0;
        var blockType = 0;
        var aBiomeIdx = 0;
        var blockData = 0;
        var blockId = 0;
        var tblockId = 0;
        var ablock = 0;
        var punkty22;
        var punkty = punkty1;
        punkty[0].offset = 0;
        punkty[1].offset = 0;
        punkty[2].offset = 0;
        
           var aindex = 0, lindex = 0, rindex = 0, lindex = 0, findex = 0, bindex = 0, tindex = 0, dindex = 0;
           var selectionIndex;
           var llight = 0,rlight = 0,tlight = 0,dlight = 0,flight = 0,blight = 0;
           var lblight = 0,rblight = 0,tblight = 0,dblight = 0,fblight = 0,bblight = 0;
           var yy = 0;
           var drawD = false;
           var drawT = false;
           var drawF = false;
           var drawB = false;
           var drawL = false;
           var drawR = false;
           var color = 0, color1 = 0, color2 = 0;
           var modPosx, modPosz;
           var blockAdd = 0;

           for(var y = yymin; y < yymax; y++){
               if(y%16 === 0){
                if(cacheId[(y+2)*324 + 19] === -1){
                    y+=15;
                    continue;
                }
               }
               for(var z = 0; z < 16; z++){
                   for(var x = 0; x < 16; x++){
                       drawD = false;
                       drawT = false;
                       drawF = false;
                       drawB = false;
                       drawL = false;
                       drawR = false;
                       
                       aindex = (y+1)*324+(z+1)*18+(x+1);
                       blockType = block[cacheId[aindex]].type;
                       if(blockType === 0) continue;
                      
                       lindex = aindex + 18;
                       rindex = aindex - 18;
                       findex = aindex - 1;
                       bindex = aindex + 1;
                       tindex = aindex + 324;
                       dindex = aindex - 324;
                       
                       var tBlockType = block[cacheId[tindex]].type;
                       var dBlockType = block[cacheId[dindex]].type;
                       var fBlockType = block[cacheId[findex]].type;
                       var bBlockType = block[cacheId[bindex]].type;
                       var rBlockType = block[cacheId[rindex]].type;
                       var lBlockType = block[cacheId[lindex]].type;
                       
                       modPosx = this.xPos % 5; if(modPosx < 0) modPosx += 5;
                       modPosz = this.zPos % 5; if(modPosz < 0) modPosz += 5;
                       selectionIndex = (yy+y)*256*256 + (z*16+x)*256 + (modPosx*5 + modPosz)*10 ;
                       
                       if(blockType === 1 || blockType === 2 || blockType === 4 || blockType === 6){
                               if(tBlockType !== 1) {
                                   tlight = cacheSlight[tindex];
                                   tblight = cacheBlight[tindex];
                                   drawT = true;
                               }

                               if(dBlockType !== 1) {
                                   dlight = cacheSlight[dindex];
                                   dblight = cacheBlight[dindex];
                                   drawD = true;
                               }
                               
                               if(rBlockType !== 1) {
                                   rlight = cacheSlight[rindex];
                                   rblight = cacheBlight[rindex];
                                   drawR = true;
                               }

                               if(lBlockType !== 1) {
                                   llight = cacheSlight[lindex];
                                   lblight = cacheBlight[lindex];
                                   drawL = true;
                               }
                               
                               if(fBlockType !== 1) {
                                   flight = cacheSlight[findex];
                                   fblight = cacheBlight[findex];
                                   drawF = true;
                               }

                               if(bBlockType !== 1) {
                                   blight = cacheSlight[bindex];
                                   bblight = cacheBlight[bindex];
                                   drawB = true;
                               }
                       } else if(blockType === 3){
                               if(tBlockType !== 1 && tBlockType !== 3) {
                                   tlight = cacheSlight[tindex];
                                   tblight = cacheBlight[tindex];
                                   drawT = true;
                               }

                               if(dBlockType !== 1 && dBlockType !== 3) {
                                   dlight = cacheSlight[dindex];
                                   dblight = cacheBlight[dindex];
                                   drawD = true;
                               }
                               
                               if(rBlockType !== 1 && rBlockType !== 3) {
                                   rlight = cacheSlight[rindex];
                                   rblight = cacheBlight[rindex];
                                   drawR = true;
                               }

                               if(lBlockType !== 1 && lBlockType !== 3) {
                                   llight = cacheSlight[lindex];
                                   lblight = cacheBlight[lindex];
                                   drawL = true;
                               }
                               
                               if(fBlockType !== 1 && fBlockType !== 3) {
                                   flight = cacheSlight[findex];
                                   fblight = cacheBlight[findex];
                                   drawF = true;
                               }

                               if(bBlockType !== 1 && bBlockType !== 3) {
                                   blight = cacheSlight[bindex];
                                   bblight = cacheBlight[bindex];
                                   drawB = true;
                               }
                       } else {
                           continue;
                       }
                       
                       if(!(drawF || drawB || drawR || drawL || drawD || drawT))
                           continue;
                       
                       blockId = cacheId[aindex];
                       blockData = cacheData[aindex];
                       
                       if(block[blockId][blockData] === undefined)
                           ablock = block[blockId][0];
                       else
                           ablock = block[blockId][blockData];
                       //////////
                       if(ablock.shapeType === undefined) continue;
                       
                            if(ablock.shapeType === 1){ // simple blocks
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                var shape2 = shape;
                                color = 0.0;
                                if(ablock.useBiomeColor === 1){ 
                                    color = this.getBiomeColor(x, z, 0);
                                }
                                /*if(blockAdd > 0){
                                    shape2 = block[200][blockAdd - 1].shape;
                                }*/
                                if(drawF){
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape2.front.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape2.front[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape2.front[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape2.front[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.front[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.front[jj+4];
                                        punkty22.data[punkty22.offset++] = flight * 100 + fblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 1;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = color;
                                    }    
                                }//back
                                if(drawB){
                                    if(blight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape2.back.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape2.back[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape2.back[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape2.back[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.back[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.back[jj+4];
                                        punkty22.data[punkty22.offset++] = blight * 100 + bblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 2;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = color;
                                    }  
                                }
                                if(drawR){ //right
                                    if(rlight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape2.right.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape2.right[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape2.right[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape2.right[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.right[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.right[jj+4];
                                        punkty22.data[punkty22.offset++] = rlight * 100 + rblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 3;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = color;
                                    }  
                                }
                                if(drawL){ //left
                                    if(llight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape2.left.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape2.left[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape2.left[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape2.left[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.left[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.left[jj+4];
                                        punkty22.data[punkty22.offset++] = llight * 100 + lblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 4;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = color;
                                    } 
                                }
                                if(drawD){ //bottom
                                    punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape2.bottom.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape2.bottom[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape2.bottom[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape2.bottom[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.bottom[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.bottom[jj+4];
                                        punkty22.data[punkty22.offset++] = dlight * 100 + dblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 5;
                                        punkty22.data[punkty22.offset++] = 0.3;
                                        punkty22.data[punkty22.offset++] = color;
                                    } 
                                }
                                if(drawT){ //top
                                    if(tlight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape2.top.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape2.top[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape2.top[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape2.top[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.top[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.top[jj+4];
                                        punkty22.data[punkty22.offset++] = tlight * 100 + tblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 6;
                                        punkty22.data[punkty22.offset++] = 1.0;
                                        punkty22.data[punkty22.offset++] = color;
                                    }   
                                }
                            } else if(ablock.shapeType === 2){ // no top / bottom
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                if(drawF) 
                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.front[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.front[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.front[jj+4];
                                        punkty22.data[punkty22.offset++] = flight * 100 + fblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 1;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = 0.0;
                                    }    
                                //back
                                if(drawB)
                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.back[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.back[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.back[jj+4];
                                        punkty22.data[punkty22.offset++] = blight * 100 + bblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 2;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = 0.0;
                                    }        
                                if(drawR) //right
                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.right[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.right[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.right[jj+4];
                                        punkty22.data[punkty22.offset++] = rlight * 100 + rblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 3;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = 0.0;
                                    }              
                                if(drawL) //left
                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.left[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.left[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.left[jj+4];
                                        punkty22.data[punkty22.offset++] = llight * 100 + lblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 4;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = 0.0;
                                    }      
                            } else if(ablock.shapeType === 3){ // custom mesh
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                flight = (flight+blight+rlight+llight+tlight)/5;
                                fblight = (fblight+bblight+rblight+lblight+tblight)/5;
                                color = 0.0;
                                if(ablock.useBiomeColor === 1){ 
                                    color = this.getBiomeColor(x, z, 0);
                                }
                                if(drawF || drawB || drawR || drawL) 
                                    for(var jj = 0; jj < shape.mesh.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.mesh[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.mesh[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.mesh[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.mesh[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.mesh[jj+4];
                                        punkty22.data[punkty22.offset++] = flight * 100 + fblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 0;
                                        punkty22.data[punkty22.offset++] = 1.0;
                                        punkty22.data[punkty22.offset++] = color;
                                    }    
                            } else if(ablock.shapeType === 4){ // dirt
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                color = this.getBiomeColor(x, z, 0);
                                if(drawF) {
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.front2.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.front2[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.front2[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.front2[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.front2[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.front2[jj+4];
                                        punkty22.data[punkty22.offset++] = flight * 100 + fblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 1;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = color;
                                    }    
                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.front[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.front[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.front[jj+4];
                                        punkty22.data[punkty22.offset++] = flight * 100 + fblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 1;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = 0.0;
                                    }    
                                }
                                //back
                                if(drawB){
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.back2.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.back2[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.back2[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.back2[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.back2[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.back2[jj+4];
                                        punkty22.data[punkty22.offset++] = blight * 100 + bblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 2;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = color;
                                    }  
                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.back[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.back[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.back[jj+4];
                                        punkty22.data[punkty22.offset++] = blight * 100 + bblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 2;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = 0.0;
                                    }        
                                }
                                if(drawR){ //right{
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.right2.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.right2[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.right2[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.right2[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.right2[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.right2[jj+4];
                                        punkty22.data[punkty22.offset++] = rlight * 100 + rblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 3;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = color;
                                    }    
                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.right[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.right[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.right[jj+4];
                                        punkty22.data[punkty22.offset++] = rlight * 100 + rblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 3;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = 0.0;
                                    }       
                                }
                                if(drawL) {//left
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.left2.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.left2[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.left2[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.left2[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.left2[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.left2[jj+4];
                                        punkty22.data[punkty22.offset++] = llight * 100 + lblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 4;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = color;
                                    }     
                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.left[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.left[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.left[jj+4];
                                        punkty22.data[punkty22.offset++] = llight * 100 + lblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 4;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = 0.0;
                                    }     
                                }
                                if(drawD){ //bottom
                                    punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.bottom[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.bottom[jj+4];
                                        punkty22.data[punkty22.offset++] = dlight * 100 + dblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 5;
                                        punkty22.data[punkty22.offset++] = 0.3;
                                        punkty22.data[punkty22.offset++] = 0.0;
                                    }     
                                }
                                if(drawT){ //top
                                    if(tlight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.top[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.top[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.top[jj+4];
                                        punkty22.data[punkty22.offset++] = tlight * 100 + tblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 6;
                                        punkty22.data[punkty22.offset++] = 1.0;
                                        punkty22.data[punkty22.offset++] = color;
                                    }
                                }
                            } else if(ablock.shapeType === 8){ // stairs
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                color = 0.0;
                                if(ablock.useBiomeColor === 1){ 
                                    color = this.getBiomeColor(x, z, 0);
                                }
                                
                                var stairsHash = "";
                                stairsHash += cacheData[aindex];
                                if(blockType === lBlockType)
                                    stairsHash += cacheData[lindex];
                                else 
                                    stairsHash += "x";
                                if(blockType === rBlockType)
                                    stairsHash += cacheData[rindex];
                                else 
                                    stairsHash += "x";
                                if(blockType === fBlockType)
                                    stairsHash += cacheData[findex];
                                else 
                                    stairsHash += "x";
                                if(blockType === bBlockType)
                                    stairsHash += cacheData[bindex];
                                else 
                                    stairsHash += "x";

                                var stairsSmall = 0;
                                var stairsPData = Chunk.stairsData[stairsHash];
                                if(stairsPData !== undefined){
                                    if(cacheData[aindex] > 3) shape = block[blockId][9].shape;
                                    else shape = block[blockId][8].shape;
                                    stairsSmall = 1;
                                }
                                if(drawF){
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.front[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.front[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.front[jj+4];
                                        punkty22.data[punkty22.offset++] = flight * 100 + fblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 1;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = color;
                                    }    
                                }//back
                                if(drawB){
                                    if(blight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.back[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.back[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.back[jj+4];
                                        punkty22.data[punkty22.offset++] = blight * 100 + bblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 2;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = color;
                                    }  
                                }
                                if(drawR){ //right
                                    if(rlight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.right[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.right[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.right[jj+4];
                                        punkty22.data[punkty22.offset++] = rlight * 100 + rblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 3;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = color;
                                    }  
                                }
                                if(drawL){ //left
                                    if(llight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.left[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.left[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.left[jj+4];
                                        punkty22.data[punkty22.offset++] = llight * 100 + lblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 4;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = color;
                                    } 
                                }
                                if(drawD){ //bottom
                                    punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.bottom[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.bottom[jj+4];
                                        punkty22.data[punkty22.offset++] = dlight * 100 + dblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 5;
                                        punkty22.data[punkty22.offset++] = 0.3;
                                        punkty22.data[punkty22.offset++] = color;
                                    } 
                                }
                                if(drawT){ //top
                                    if(tlight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.top[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.top[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.top[jj+4];
                                        punkty22.data[punkty22.offset++] = tlight * 100 + tblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 6;
                                        punkty22.data[punkty22.offset++] = 1.0;
                                        punkty22.data[punkty22.offset++] = color;
                                    }   
                                }
                                if(stairsSmall === 1){
                                    shape = block[blockId][10].shape;
                                    //console.log(stairsPdata);
                                    var stairsx = 0;
                                    var stairsy = 0;
                                    if(cacheData[aindex] > 3) stairsy = -0.5;
                                    var stairsz = 0;
                                    for(var ismall = 0; ismall < 4; ismall++){
                                        if(stairsPData.charCodeAt(ismall)-48 === 0) continue; 
                                        stairsx = (ismall%2)/2;
                                        if(ismall>1) stairsz = 0.5; else stairsz = 0;
                                        if(drawF){
                                            if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                            else punkty22 = punkty[drawLevel];
                                            for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                                punkty22.data[punkty22.offset++] = stairsx+this.xPos*16+x+shape.front[jj];
                                                punkty22.data[punkty22.offset++] = stairsy+yy+y+shape.front[jj+1]; 
                                                punkty22.data[punkty22.offset++] = stairsz+this.zPos*16+z+shape.front[jj+2];
                                                punkty22.data[punkty22.offset++] = shape.front[jj+3]; 
                                                punkty22.data[punkty22.offset++] = shape.front[jj+4];
                                                punkty22.data[punkty22.offset++] = flight * 100 + fblight;
                                                punkty22.data[punkty22.offset++] = selectionIndex + 1;
                                                punkty22.data[punkty22.offset++] = 0.8;
                                                punkty22.data[punkty22.offset++] = color;
                                            }    
                                        }//back
                                        if(drawB){
                                            if(blight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                            else punkty22 = punkty[drawLevel];
                                            for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                                punkty22.data[punkty22.offset++] = stairsx+this.xPos*16+x+shape.back[jj];
                                                punkty22.data[punkty22.offset++] = stairsy+yy+y+shape.back[jj+1]; 
                                                punkty22.data[punkty22.offset++] = stairsz+this.zPos*16+z+shape.back[jj+2];
                                                punkty22.data[punkty22.offset++] = shape.back[jj+3]; 
                                                punkty22.data[punkty22.offset++] = shape.back[jj+4];
                                                punkty22.data[punkty22.offset++] = blight * 100 + bblight;
                                                punkty22.data[punkty22.offset++] = selectionIndex + 2;
                                                punkty22.data[punkty22.offset++] = 0.8;
                                                punkty22.data[punkty22.offset++] = color;
                                            }  
                                        }
                                        if(drawR){ //right
                                            if(rlight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                            else punkty22 = punkty[drawLevel];
                                            for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                                punkty22.data[punkty22.offset++] = stairsx+this.xPos*16+x+shape.right[jj];
                                                punkty22.data[punkty22.offset++] = stairsy+yy+y+shape.right[jj+1]; 
                                                punkty22.data[punkty22.offset++] = stairsz+this.zPos*16+z+shape.right[jj+2];
                                                punkty22.data[punkty22.offset++] = shape.right[jj+3]; 
                                                punkty22.data[punkty22.offset++] = shape.right[jj+4];
                                                punkty22.data[punkty22.offset++] = rlight * 100 + rblight;
                                                punkty22.data[punkty22.offset++] = selectionIndex + 3;
                                                punkty22.data[punkty22.offset++] = 0.55;
                                                punkty22.data[punkty22.offset++] = color;
                                            }  
                                        }
                                        if(drawL){ //left
                                            if(llight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                            else punkty22 = punkty[drawLevel];
                                            for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                                punkty22.data[punkty22.offset++] = stairsx+this.xPos*16+x+shape.left[jj];
                                                punkty22.data[punkty22.offset++] = stairsy+yy+y+shape.left[jj+1]; 
                                                punkty22.data[punkty22.offset++] = stairsz+this.zPos*16+z+shape.left[jj+2];
                                                punkty22.data[punkty22.offset++] = shape.left[jj+3]; 
                                                punkty22.data[punkty22.offset++] = shape.left[jj+4];
                                                punkty22.data[punkty22.offset++] = llight * 100 + lblight;
                                                punkty22.data[punkty22.offset++] = selectionIndex + 4;
                                                punkty22.data[punkty22.offset++] = 0.55;
                                                punkty22.data[punkty22.offset++] = color;
                                            } 
                                        }
                                        if(drawD){ //bottom
                                            punkty22 = punkty[drawLevel];
                                            for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                                punkty22.data[punkty22.offset++] = stairsx+this.xPos*16+x+shape.bottom[jj];
                                                punkty22.data[punkty22.offset++] = stairsy+yy+y+shape.bottom[jj+1]; 
                                                punkty22.data[punkty22.offset++] = stairsz+this.zPos*16+z+shape.bottom[jj+2];
                                                punkty22.data[punkty22.offset++] = shape.bottom[jj+3]; 
                                                punkty22.data[punkty22.offset++] = shape.bottom[jj+4];
                                                punkty22.data[punkty22.offset++] = dlight * 100 + dblight;
                                                punkty22.data[punkty22.offset++] = selectionIndex + 5;
                                                punkty22.data[punkty22.offset++] = 0.3;
                                                punkty22.data[punkty22.offset++] = color;
                                            } 
                                        }
                                        if(drawT){ //top
                                            if(tlight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                            else punkty22 = punkty[drawLevel];
                                            for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                                punkty22.data[punkty22.offset++] = stairsx+this.xPos*16+x+shape.top[jj];
                                                punkty22.data[punkty22.offset++] = stairsy+yy+y+shape.top[jj+1]; 
                                                punkty22.data[punkty22.offset++] = stairsz+this.zPos*16+z+shape.top[jj+2];
                                                punkty22.data[punkty22.offset++] = shape.top[jj+3]; 
                                                punkty22.data[punkty22.offset++] = shape.top[jj+4];
                                                punkty22.data[punkty22.offset++] = tlight * 100 + tblight;
                                                punkty22.data[punkty22.offset++] = selectionIndex + 6;
                                                punkty22.data[punkty22.offset++] = 1.0;
                                                punkty22.data[punkty22.offset++] = color;
                                            }   
                                        }
                                    }
                                }
                            } else if(ablock.shapeType === 5){ // fences
                                if(drawF || drawB || drawR || drawL || drawT || drawD) {
                                    drawLevel = ablock.drawLevel;
                                    punkty22 = punkty[drawLevel];
                                    var shape = ablock.shape;
                                    color = 0.0;
                                    if(ablock.useBiomeColor === 1){ 
                                        color = this.getBiomeColor(x, z, 0);
                                    }                                

                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        if(jj%30 === 0){
                                            if((jj === 60) || (jj === 120)){
                                                if(blockType !== lBlockType && lBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 30) || (jj === 90)){
                                                if(blockType !== rBlockType && rBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                        }
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.front[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.front[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.front[jj+4];
                                        punkty22.data[punkty22.offset++] = flight * 100 + fblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 1;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = color;
                                    }    

                                    if(blight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        if(jj%30 === 0){
                                            if((jj === 60) || (jj === 120)){
                                                if(blockType !== lBlockType && lBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 30) || (jj === 90)){
                                                if(blockType !== rBlockType && rBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                        }
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.back[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.back[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.back[jj+4];
                                        punkty22.data[punkty22.offset++] = blight * 100 + bblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 2;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = color;
                                    }  

                                    if(rlight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        if(jj%30 === 0){
                                            if((jj === 30) || (jj === 90)){
                                                if(blockType !== fBlockType && fBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 60) || (jj === 120)){
                                                if(blockType !== bBlockType && bBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                        }
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.right[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.right[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.right[jj+4];
                                        punkty22.data[punkty22.offset++] = rlight * 100 + rblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 3;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = color;
                                    }  

                                    if(llight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        if(jj%30 === 0){
                                            if((jj === 30) || (jj === 90)){
                                                if(blockType !== fBlockType && fBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 60) || (jj === 120)){
                                                if(blockType !== bBlockType && bBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                        }
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.left[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.left[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.left[jj+4];
                                        punkty22.data[punkty22.offset++] = llight * 100 + lblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 4;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = color;
                                    } 

                                    punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                        if(jj%30 === 0){
                                            if((jj === 30) || (jj === 150)){
                                                if(blockType !== rBlockType && rBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 60) || (jj === 180)){
                                                if(blockType !== lBlockType && lBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 90) || (jj === 210)){
                                                if(blockType !== fBlockType && fBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }      
                                            if((jj === 120) || (jj === 240)){
                                                if(blockType !== bBlockType && bBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }   
                                        }
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.bottom[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.bottom[jj+4];
                                        punkty22.data[punkty22.offset++] = dlight * 100 + dblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 5;
                                        punkty22.data[punkty22.offset++] = 0.3;
                                        punkty22.data[punkty22.offset++] = color;
                                    } 

                                    if(tlight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                        if(jj%30 === 0){
                                            if((jj === 30) || (jj === 150)){
                                                if(blockType !== rBlockType && rBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 60) || (jj === 180)){
                                                if(blockType !== lBlockType && lBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 90) || (jj === 210)){
                                                if(blockType !== fBlockType && fBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }      
                                            if((jj === 120) || (jj === 240)){
                                                if(blockType !== bBlockType && bBlockType !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }   
                                        }
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.top[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.top[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.top[jj+4];
                                        punkty22.data[punkty22.offset++] = tlight * 100 + tblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 6;
                                        punkty22.data[punkty22.offset++] = 1.0;
                                        punkty22.data[punkty22.offset++] = color;
                                    }   
                                }
                            } else if(ablock.shapeType === 6){ // no top / bottom + simple light
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                color = 0.0;
                                if(ablock.useBiomeColor === 1){ 
                                    color = this.getBiomeColor(x, z, 0);
                                }                                
                                if(drawF || drawB || drawR || drawL || drawD || drawT) {
                                    if(blockData === 5){
                                        if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                        else punkty22 = punkty[drawLevel];
                                        for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                            punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.front[jj];
                                            punkty22.data[punkty22.offset++] = yy+y+shape.front[jj+1]; 
                                            punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.front[jj+2];
                                            punkty22.data[punkty22.offset++] = shape.front[jj+3]; 
                                            punkty22.data[punkty22.offset++] = shape.front[jj+4];
                                            punkty22.data[punkty22.offset++] = flight * 100 + fblight;
                                            punkty22.data[punkty22.offset++] = selectionIndex + 1;
                                            punkty22.data[punkty22.offset++] = 0.8;
                                            punkty22.data[punkty22.offset++] = color;
                                        }    
                                    }//back
                                    if(blockData === 4){
                                        if(blight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                        else punkty22 = punkty[drawLevel];
                                        for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                            punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.back[jj];
                                            punkty22.data[punkty22.offset++] = yy+y+shape.back[jj+1]; 
                                            punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.back[jj+2];
                                            punkty22.data[punkty22.offset++] = shape.back[jj+3]; 
                                            punkty22.data[punkty22.offset++] = shape.back[jj+4];
                                            punkty22.data[punkty22.offset++] = blight * 100 + bblight;
                                            punkty22.data[punkty22.offset++] = selectionIndex + 2;
                                            punkty22.data[punkty22.offset++] = 0.8;
                                            punkty22.data[punkty22.offset++] = color;
                                        }  
                                    }
                                    if(blockData === 3){ //right
                                        if(rlight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                        else punkty22 = punkty[drawLevel];
                                        for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                            punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.right[jj];
                                            punkty22.data[punkty22.offset++] = yy+y+shape.right[jj+1]; 
                                            punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.right[jj+2];
                                            punkty22.data[punkty22.offset++] = shape.right[jj+3]; 
                                            punkty22.data[punkty22.offset++] = shape.right[jj+4];
                                            punkty22.data[punkty22.offset++] = rlight * 100 + rblight;
                                            punkty22.data[punkty22.offset++] = selectionIndex + 3;
                                            punkty22.data[punkty22.offset++] = 0.55;
                                            punkty22.data[punkty22.offset++] = color;
                                        }  
                                    }
                                    if(blockData === 2){ //left
                                        if(llight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                        else punkty22 = punkty[drawLevel];
                                        for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                            punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.left[jj];
                                            punkty22.data[punkty22.offset++] = yy+y+shape.left[jj+1]; 
                                            punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.left[jj+2];
                                            punkty22.data[punkty22.offset++] = shape.left[jj+3]; 
                                            punkty22.data[punkty22.offset++] = shape.left[jj+4];
                                            punkty22.data[punkty22.offset++] = llight * 100 + lblight;
                                            punkty22.data[punkty22.offset++] = selectionIndex + 4;
                                            punkty22.data[punkty22.offset++] = 0.55;
                                            punkty22.data[punkty22.offset++] = color;
                                        } 
                                    }
                                }
                            } else if(ablock.shapeType === 9){ // water / lava
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                color = 0.0;
                                if(ablock.useBiomeColor === 1){ 
                                    //if((biomes[this.cacheBiomes[(z)*18+x]].waterColor || false))
                                        color = this.getBiomeColor(x, z, 2);
                                }

                                if(drawF){
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.front[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.front[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.front[jj+4];
                                        punkty22.data[punkty22.offset++] = flight * 100 + fblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 1;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = color;
                                    }    
                                }//back
                                if(drawB){
                                    if(blight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.back[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.back[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.back[jj+4];
                                        punkty22.data[punkty22.offset++] = blight * 100 + bblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 2;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = color;
                                    }  
                                }
                                if(drawR){ //right
                                    if(rlight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.right[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.right[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.right[jj+4];
                                        punkty22.data[punkty22.offset++] = rlight * 100 + rblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 3;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = color;
                                    }  
                                }
                                if(drawL){ //left
                                    if(llight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.left[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.left[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.left[jj+4];
                                        punkty22.data[punkty22.offset++] = llight * 100 + lblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 4;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = color;
                                    } 
                                }
                                if(drawD){ //bottom
                                    punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.bottom[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.bottom[jj+4];
                                        punkty22.data[punkty22.offset++] = dlight * 100 + dblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 5;
                                        punkty22.data[punkty22.offset++] = 0.3;
                                        punkty22.data[punkty22.offset++] = color;
                                    } 
                                }
                                if(drawT){ //top
                                    if(tlight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.top[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.top[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.top[jj+4];
                                        punkty22.data[punkty22.offset++] = tlight * 100 + tblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 6;
                                        punkty22.data[punkty22.offset++] = 1.0;
                                        punkty22.data[punkty22.offset++] = color;
                                    }   
                                }
                            } else if(ablock.shapeType === 10){ // vines
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                color = 0.0;
                                if(ablock.useBiomeColor === 1){ 
                                    color = this.getBiomeColor(x, z, 0);
                                }
                                if(drawF || drawB || drawR || drawL || drawD || drawT) {
                                if((cacheData[aindex] & 0x08) === 8){
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.front[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.front[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.front[jj+4];
                                        punkty22.data[punkty22.offset++] = flight * 100 + fblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 1;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = color;
                                    }    
                                }//back
                                if((cacheData[aindex] & 0x02) === 2){
                                    if(blight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.back[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.back[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.back[jj+4];
                                        punkty22.data[punkty22.offset++] = blight * 100 + bblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 2;
                                        punkty22.data[punkty22.offset++] = 0.8;
                                        punkty22.data[punkty22.offset++] = color;
                                    }  
                                }
                                if((cacheData[aindex] & 0x01) === 1){
                                    if(rlight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.right[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.right[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.right[jj+4];
                                        punkty22.data[punkty22.offset++] = rlight * 100 + rblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 3;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = color;
                                    }  
                                }
                                if((cacheData[aindex] & 0x04) === 4){
                                    if(llight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.left[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.left[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.left[jj+4];
                                        punkty22.data[punkty22.offset++] = llight * 100 + lblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 4;
                                        punkty22.data[punkty22.offset++] = 0.55;
                                        punkty22.data[punkty22.offset++] = color;
                                    } 
                                }
                                if(tBlockType === 1 || cacheData[aindex] === 0 ){ 
                                    punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                        punkty22.data[punkty22.offset++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.data[punkty22.offset++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.data[punkty22.offset++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.data[punkty22.offset++] = shape.bottom[jj+3]; 
                                        punkty22.data[punkty22.offset++] = shape.bottom[jj+4];
                                        punkty22.data[punkty22.offset++] = dlight * 100 + dblight;
                                        punkty22.data[punkty22.offset++] = selectionIndex + 5;
                                        punkty22.data[punkty22.offset++] = 0.3;
                                        punkty22.data[punkty22.offset++] = color;
                                    } 
                                }
                                }
                            }
                        }
               }
           }           
           
           
        //} 

        if(this.vbo !== undefined){
            if(yyyy === 0 && this.vbo[0] !== undefined)
            this.vbo[0].forEach(function(e) {
                gl.deleteBuffer(e);
            });
            if(yyyy === 1 && this.vbo[1] !== undefined)
            this.vbo[1].forEach(function(e) {
                gl.deleteBuffer(e);
            });
        }
            
        //this.ivbo = new Array();
        //this.vbo = new Array();
        if(yyyy === 0){
            this.ivbo[0] = new Array();
            this.vbo[0] = new Array();

            for(var i = 0; i < 3; i++){
               if(punkty[i].offset>0){
                   //if(punkty[i].offset>10) console.log(i+" "+punkty[i].offset);
                   var tpunkty = new Float32Array(punkty[i].data.buffer, 0, punkty[i].offset);
                   this.ivbo[0][i] = tpunkty.length;
                   this.vbo[0][i] = gl.createBuffer();
                   gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[0][i]);
                   gl.bufferData(gl.ARRAY_BUFFER, tpunkty, gl.STATIC_DRAW);
                   tpunkty = null;
               }
            }
            this.isInit = 1;
        }
        if(yyyy === 1){
            this.ivbo[1] = new Array();
            this.vbo[1] = new Array();
            
            for(var i = 0; i < 3; i++){
               if(punkty[i].offset>0){
                   //if(punkty[i].offset>10) console.log(i+" "+punkty[i].offset);
                   var tpunkty = new Float32Array(punkty[i].data.buffer, 0, punkty[i].offset);
                   this.ivbo[1][i] = tpunkty.length;
                   this.vbo[1][i] = gl.createBuffer();
                   gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[1][i]);
                   gl.bufferData(gl.ARRAY_BUFFER, tpunkty, gl.STATIC_DRAW);
                   tpunkty = null;
               }
            }
            this.isInit1 = 1;
        }

        ///////////////////////////////////
        ///////////////////////////////////
        ///////////////////////////////////
        //var timeNow3 = new Date().getTime();
        //console.log("time 2 "+(timeNow3-timeNow1));
        return true;
    };
