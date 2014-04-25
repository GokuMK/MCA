Chunk.prototype.getBuffer = function(pos){
    
        var z = 0;
        var skyf = 0, index = 0, index2 = 0;
        
        var nietlchunk = false;
        var nietrchunk = false;
        var nietfchunk = false;
        var nietbchunk = false;

        punkty1[0].o = 0;
        
        var drawLevel = 0;
        var blockType = 0;
        var aBiomeIdx = 0;
        var blockData = 0;
        var blockId = 0;
        var tblockId = 0;
        var ablock = 0;
        
        var punkty22;
        
        var tbchunk = mcWorld.requestChunk(this.xPos+1, this.zPos);
        if(tbchunk === undefined) nietbchunk = true;
        if(tbchunk === -1) nietbchunk = true;
        if(tbchunk === -2) return false;
        var tfchunk = mcWorld.requestChunk(this.xPos-1, this.zPos);
        if(tfchunk === undefined) nietfchunk = true;
        if(tfchunk === -1) nietfchunk = true;
        if(tfchunk === -2) return false;
        var tlchunk = mcWorld.requestChunk(this.xPos, this.zPos+1);
        if(tlchunk === undefined) nietlchunk = true;
        if(tlchunk === -1) nietlchunk = true;
        if(tlchunk === -2) return false;
        var trchunk = mcWorld.requestChunk(this.xPos, this.zPos-1);
        if(trchunk === undefined) nietrchunk = true;
        if(trchunk === -1) nietrchunk = true;
        if(trchunk === -2) return false;
        
        this.cacheBiomes = new Float32Array(18*18);
       
        var posy = Math.floor(pos[1]/16);
        var yymin = posy; 
        if(pos[1] - posy*16 < 2) 
            yymin--;
        if(yymin<0) yymin = 0;
        var yymax = posy;
        if(pos[1] - posy*16 > 13) 
            yymax++;
        if(yymax>16) yymax = 16;
        
        for(var i = yymin; i <= yymax; i++ ){

           if(this.section[i] === undefined) continue;
           
           var asection = this.section[i];
            
           var dsection = this.section[i-1];
           var niedsection = false;
           if(dsection === undefined) niedsection = true;
           var tsection = this.section[i+1];
           var nietsection = false;
           if(tsection === undefined) nietsection = true;
           
           var niefsection = true;
           var niebsection = true;
           var niersection = true;
           var nielsection = true;

           if(!nietfchunk){
               var fsection = tfchunk.section[i];
               if(fsection !== undefined) niefsection = false;
           }
           
           if(!nietbchunk){
               var bsection = tbchunk.section[i];
               if(bsection !== undefined) niebsection = false;
           }
           if(!nietrchunk){
               var rsection = trchunk.section[i];
               if(rsection !== undefined) niersection = false;
           }
           if(!nietlchunk){
               var lsection = tlchunk.section[i];
               if(lsection !== undefined) nielsection = false;
           }
           var xmin = pos[0] - 3; if(xmin < 0) xmin = 0;
           var xmax = pos[0] + 4; if(xmax > 16) xmax = 16; 
           var zmin = pos[2] - 3; if(zmin < 0) zmin = 0;
           var zmax = pos[2] + 4; if(zmax > 16) zmax = 16; 
           var ymin = pos[1] - i*16 - 3; if(ymin < 0) ymin = 0;
           var ymax = pos[1] - i*16 + 3; if(ymax > 16) ymax = 16; 
           ///console.log(xmin+" "+xmax+" "+zmin+" "+zmax);
           // bloczki tego chunka
           for(var y = ymin; y < ymax; y++){
               for(var z = zmin; z < zmax; z++){
                   for(var x = xmin; x < xmax; x++){
                       index = y*256+z*16+x;
                       index2 = (y+1)*324 + (z+1)*18 + (x+1);
                       Chunk.cacheBlock[index2] = block[asection.blocks[index]].type;
                       skyf = index % 2;
                       if(skyf === 0){
                           Chunk.cacheData[index2] = (asection.data[(index/2)] & 0x0F) & block[asection.blocks[index]].mask;
                      }else{
                           Chunk.cacheData[index2] = ((asection.data[(index/2 - 0.5)] >> 4) & 0x0F) & block[asection.blocks[index]].mask;
                       }
                   }
                   this.cacheBiomes[(y+1)*18 + z + 1] = this.biomes[(y)*16 + z];
               }
           }
           //dolny poziom
           if(niedsection){
               for(var z = 0; z < 16; z++)
                   for(var x = 0; x < 16; x++){
                       index2 = 0 + (z+1)*18 + (x+1);
                       if(i === 0) Chunk.cacheBlock[index2] = 1;
                       else Chunk.cacheBlock[index2] = 0;
                       /*Chunk.cacheData[index2] = 0;
                       Chunk.cacheId[index2] = 0;*/
                   }
           } else {
               for(var z = 0; z < 16; z++)
                   for(var x = 0; x < 16; x++){
                       index = 15*256+z*16+x;
                       index2 = 0 + (z+1)*18 + (x+1);
                       Chunk.cacheBlock[index2] = block[dsection.blocks[index]].type;
                       skyf = index % 2;
                       if(skyf === 0){
                           //Chunk.cacheData[index2] = (dsection.data[(index/2)] & 0x0F) & block[dsection.blocks[index]].mask;
                       }else{
                           //Chunk.cacheData[index2] = ((dsection.data[(index/2 - 0.5)] >> 4) & 0x0F) & block[dsection.blocks[index]].mask;
                       }   
                   }
           }
           //gorny poziom
           if(nietsection){
               for(var z = 0; z < 16; z++)
                   for(var x = 0; x < 16; x++){
                       index2 = 17*324 + (z+1)*18 + (x+1);
                       if(i === 15) Chunk.cacheBlock[index2] = 1;
                       else Chunk.cacheBlock[index2] = 0;
                       /*Chunk.cacheData[index2] = 0;
                       Chunk.cacheId[index2] = 0;*/
                   }
           } else {
               for(var z = 0; z < 16; z++)
                   for(var x = 0; x < 16; x++){
                       index = 0*256+z*16+x;
                       index2 = 17*324 + (z+1)*18 + (x+1);
                       Chunk.cacheBlock[index2] = block[tsection.blocks[index]].type;
                       skyf = index % 2;
                       if(skyf === 0){
                           //Chunk.cacheData[index2] = (tsection.data[(index/2)] & 0x0F) & block[tsection.blocks[index]].mask;
                       }else{
                           //Chunk.cacheData[index2] = ((tsection.data[(index/2 - 0.5)] >> 4) & 0x0F) & block[tsection.blocks[index]].mask;
                       }   
                   }
           }
           //left
           if(nielsection){
               for(var y = 0; y < 16; y++){
                   for(var x = 0; x < 16; x++){
                       index2 = (y+1)*324 + (17)*18 + (x+1);
                       if(nietlchunk) Chunk.cacheBlock[index2] = 1;
                       else Chunk.cacheBlock[index2] = 0;
                       /*Chunk.cacheData[index2] = 0;
                       Chunk.cacheId[index2] = 0;*/
                   }
                //   this.cacheBiomes[17*18 + (y + 1)] = this.cacheBiomes[16*18 + (y + 1)];
               }
           } else {
               for(var y = 0; y < 16; y++){
                   for(var x = 0; x < 16; x++){
                       index = y*256 + 0*16 + x;
                       index2 = (y+1)*324 + (17)*18 + (x+1);
                       Chunk.cacheBlock[index2] = block[lsection.blocks[index]].type;
                       //Chunk.cacheId[index2] = lsection.blocks[index];
                       skyf = index % 2;
                       if(skyf === 0){
                           //Chunk.cacheData[index2] = (lsection.data[(index/2)] & 0x0F) & block[lsection.blocks[index]].mask;
                       }else{
                           //Chunk.cacheData[index2] = ((lsection.data[(index/2 - 0.5)] >> 4) & 0x0F) & block[lsection.blocks[index]].mask;
                       }   
                   }
                //   this.cacheBiomes[17*18 + (y + 1)] = tlchunk.biomes[0 + (y)];
               }
           }
           //right
           if(niersection){
               for(var y = 0; y < 16; y++){
                   for(var x = 0; x < 16; x++){
                       index2 = (y+1)*324 + (0)*18 + (x+1);
                       if(nietrchunk) Chunk.cacheBlock[index2] = 1;
                       else Chunk.cacheBlock[index2] = 0;
                       /*Chunk.cacheData[index2] = 0;
                       Chunk.cacheId[index2] = 0;*/
                   }
                 //  this.cacheBiomes[0 + (y + 1)] = this.cacheBiomes[18 + (y + 1)];
               }
           } else {
               for(var y = 0; y < 16; y++){
                   for(var x = 0; x < 16; x++){
                       index = y*256 + 15*16 + x;
                       index2 = (y+1)*324 + (0)*18 + (x+1);
                       Chunk.cacheBlock[index2] = block[rsection.blocks[index]].type;
                       //Chunk.cacheId[index2] = rsection.blocks[index];
                       skyf = index % 2;
                       if(skyf === 0){
                           //Chunk.cacheData[index2] = (rsection.data[(index/2)] & 0x0F) & block[rsection.blocks[index]].mask;
                       }else{
                           //Chunk.cacheData[index2] = ((rsection.data[(index/2 - 0.5)] >> 4) & 0x0F) & block[rsection.blocks[index]].mask;
                       }
                   }
                 //  this.cacheBiomes[0 + (y + 1)] = trchunk.biomes[15*16 + (y)];
               }
           }
           //front
           if(niefsection){
               for(var y = 0; y < 16; y++){
                   for(var z = 0; z < 16; z++){
                       index2 = (y+1)*324 + (z+1)*18 + (0);
                       if(nietfchunk) Chunk.cacheBlock[index2] = 1;
                       else Chunk.cacheBlock[index2] = 0;
                       /*Chunk.cacheData[index2] = 0;
                       Chunk.cacheId[index2] = 0;*/
                   }
                  // this.cacheBiomes[(y+1)*18 + 0] = this.cacheBiomes[(y+1)*18 + 1];
               }
           } else {
               for(var y = 0; y < 16; y++){
                   for(var z = 0; z < 16; z++){
                       index = y*256 + z*16 + 15;
                       index2 = (y+1)*324 + (z+1)*18 + (0);
                       Chunk.cacheBlock[index2] = block[fsection.blocks[index]].type;
                       //Chunk.cacheId[index2] = fsection.blocks[index];
                       skyf = index % 2;
                       if(skyf === 0){
                           //Chunk.cacheData[index2] = (fsection.data[(index/2)] & 0x0F) & block[fsection.blocks[index]].mask;
                       }else{
                           //Chunk.cacheData[index2] = ((fsection.data[(index/2 - 0.5)] >> 4) & 0x0F) & block[fsection.blocks[index]].mask;
                       }   
                   }
                   //this.cacheBiomes[(y+1)*18 + 0] = tfchunk.biomes[y*16 + 15];
               }
           }
           //back
           if(niebsection){
               for(var y = 0; y < 16; y++){
                   for(var z = 0; z < 16; z++){
                       index2 = (y+1)*324 + (z+1)*18 + (17);
                       if(nietbchunk) Chunk.cacheBlock[index2] = 1;
                       else Chunk.cacheBlock[index2] = 0;
                       /*Chunk.cacheData[index2] = 0;
                       Chunk.cacheId[index2] = 0;*/
                   }
                   //this.cacheBiomes[(y+1)*18 + 17] = this.cacheBiomes[(y+1)*18 + 16];
                   
               }
           } else {
               for(var y = 0; y < 16; y++){
                   for(var z = 0; z < 16; z++){
                       index = y*256 + z*16 + 0;
                       index2 = (y+1)*324 + (z+1)*18 + (17);
                       Chunk.cacheBlock[index2] = block[bsection.blocks[index]].type;
                       //Chunk.cacheId[index2] = bsection.blocks[index];
                       skyf = index % 2;
                       if(skyf === 0){
                           //Chunk.cacheData[index2] = (bsection.data[(index/2)] & 0x0F) & block[bsection.blocks[index]].mask;
                       }else{
                           //Chunk.cacheData[index2] = ((bsection.data[(index/2 - 0.5)] >> 4) & 0x0F) & block[bsection.blocks[index]].mask;
                       }   
                   }
                  // this.cacheBiomes[(y+1)*18 + 17] = tbchunk.biomes[y*16 + 0];
               }
           }  
           
        ///////////////////////////////////
        ///////////////////////////////////
        ///////////////////////////////////
           // bloczki tego chunka
           var aindex = 0, lindex = 0, rindex = 0, lindex = 0, findex = 0, bindex = 0, tindex = 0, dindex = 0;
           var selectionIndex;
           var llight = 0,rlight = 0,tlight = 0,dlight = 0,flight = 0,blight = 0;
           var lblight = 0,rblight = 0,tblight = 0,dblight = 0,fblight = 0,bblight = 0;
           var yy = i*16;
           var drawD = false;
           var drawT = false;
           var drawF = false;
           var drawB = false;
           var drawL = false;
           var drawR = false;
           var color = 0, color1 = 0, color2 = 0;
           var modPosx, modPosz;
           var blockAdd = 0;
           //var cacheBlock = Chunk.cacheBlock;
           for(var y = ymin; y < ymax; y++){
               //for(var z = 0; z < 16; z++){
               //    for(var x = 0; x < 16; x++){
               for(var z = zmin; z < zmax; z++){
                   for(var x = xmin; x < xmax; x++){
                       drawD = false;
                       drawT = false;
                       drawF = false;
                       drawB = false;
                       drawL = false;
                       drawR = false;
                       
                       aindex = (y+1)*324+(z+1)*18+(x+1);
                       blockType = Chunk.cacheBlock[aindex];
                       if(blockType === 0) continue;
                       lindex = aindex + 18;
                       rindex = aindex - 18;
                       findex = aindex - 1;
                       bindex = aindex + 1;
                       tindex = aindex + 324;
                       dindex = aindex - 324;

                       index = (y)*256+(z)*16+(x);
                       
                       // drawT = true;
                       modPosx = this.xPos % 5; if(modPosx < 0) modPosx += 5;
                       modPosz = this.zPos % 5; if(modPosz < 0) modPosz += 5;
                       selectionIndex = (yy+y)*256*256 + (z*16+x)*256 + (modPosx*5 + modPosz)*10 ;
                       
                       if(blockType === 1 || blockType === 2 || blockType === 4 || blockType === 6){
                               if(Chunk.cacheBlock[tindex] !== 1) {
                                   drawT = true;
                               }

                               if(Chunk.cacheBlock[dindex] !== 1) {
                                   drawD = true;
                               }
                               
                               if(Chunk.cacheBlock[rindex] !== 1) {
                                   drawR = true;
                               }

                               if(Chunk.cacheBlock[lindex] !== 1) {
                                   drawL = true;
                               }
                               
                               if(Chunk.cacheBlock[findex] !== 1) {
                                   drawF = true;
                               }

                               if(Chunk.cacheBlock[bindex] !== 1) {
                                   drawB = true;
                               }
                       } else if(blockType === 3){
                               if(Chunk.cacheBlock[tindex] !== 1 && Chunk.cacheBlock[tindex] !== 3) {
                                   drawT = true;
                               }

                               if(Chunk.cacheBlock[dindex] !== 1 && Chunk.cacheBlock[dindex] !== 3) {
                                   drawD = true;
                               }
                               
                               if(Chunk.cacheBlock[rindex] !== 1 && Chunk.cacheBlock[rindex] !== 3) {
                                   drawR = true;
                               }

                               if(Chunk.cacheBlock[lindex] !== 1 && Chunk.cacheBlock[lindex] !== 3) {
                                   drawL = true;
                               }
                               
                               if(Chunk.cacheBlock[findex] !== 1 && Chunk.cacheBlock[findex] !== 3) {
                                   drawF = true;
                               }

                               if(Chunk.cacheBlock[bindex] !== 1 && Chunk.cacheBlock[bindex] !== 3) {
                                   drawB = true;
                               }
                       } else {
                           continue;
                       }
                       
                       if(!(drawF || drawB || drawR || drawL || drawD || drawT))
                           continue;
                       punkty22 = punkty1[0];
                       blockId = asection.blocks[index];
                       skyf = index % 2;
                       if(skyf === 0){
                           blockData = (asection.data[(index/2)] & 0x0F) & block[asection.blocks[index]].mask;
                           blockAdd = (asection.add[(index/2)] & 0x0F);
                       }else{
                           blockData = ((asection.data[(index/2 - 0.5)] >> 4) & 0x0F) & block[asection.blocks[index]].mask;
                           blockAdd = ((asection.add[(index/2 - 0.5)] >> 4) & 0x0F);
                       }  
                       
                       if(block[blockId][blockData] === undefined)
                           ablock = block[blockId][0];
                       else
                           ablock = block[blockId][blockData];
                       //////////
                       if(ablock.shapeType === undefined) continue;
                       
                            if(ablock.shapeType === 1){ // simple blocks
                                var shape = ablock.shape;
                                var shape2 = shape;
                                color = 0.0;
                                if(ablock.useBiomeColor === 1){ 
                                    color = this.getBiomeColor(x, z, 0);
                                }
                                if(blockAdd > 0){
                                    shape2 = block[200][blockAdd - 1].shape;
                                }
                                if(drawF){
                                    for(var jj = 0; jj < shape2.front.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }    
                                }//back
                                if(drawB){
                                    for(var jj = 0; jj < shape2.back.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = blight * 100 + bblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                }
                                if(drawR){ //right
                                    for(var jj = 0; jj < shape2.right.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = rlight * 100 + rblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                }
                                if(drawL){ //left
                                    for(var jj = 0; jj < shape2.left.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = llight * 100 + lblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    } 
                                }
                                if(drawD){ //bottom
                                    for(var jj = 0; jj < shape2.bottom.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = dlight * 100 + dblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 0.3;
                                        punkty22.d[punkty22.o++] = color;
                                    } 
                                }
                                if(drawT){ //top
                                    for(var jj = 0; jj < shape2.top.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = tlight * 100 + tblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    }   
                                }
                            } else if(ablock.shapeType === 2){ // no top / bottom
                               /* var shape = ablock.shape;
                                if(drawF) 
                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    }    
                                //back
                                if(drawB)
                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = blight * 100 + bblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    }        
                                if(drawR) //right
                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = rlight * 100 + rblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    }              
                                if(drawL) //left
                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = llight * 100 + lblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    }      */
                            } else if(ablock.shapeType === 3){ // custom mesh
                                /*var shape = ablock.shape;
                                flight = (flight+blight+rlight+llight+tlight)/5;
                                fblight = (fblight+bblight+rblight+lblight+tblight)/5;
                                color = 0.0;
                                if(ablock.useBiomeColor === 1){ 
                                    color = this.getBiomeColor(x, z, 0);
                                }
                                if(drawF || drawB || drawR || drawL) 
                                    for(var jj = 0; jj < shape.mesh.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.mesh[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.mesh[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.mesh[jj+2];
                                        punkty22.d[punkty22.o++] = shape.mesh[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.mesh[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 0;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    }    */
                            } else if(ablock.shapeType === 4){ // dirt
                                var shape = ablock.shape;
                                color = this.getBiomeColor(x, z, 0);
                                if(drawF) {
                                    for(var jj = 0; jj < shape.front2.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front2[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front2[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front2[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front2[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front2[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }    
                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    }    
                                }
                                //back
                                if(drawB){
                                    for(var jj = 0; jj < shape.back2.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back2[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back2[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back2[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back2[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back2[jj+4];
                                        punkty22.d[punkty22.o++] = blight * 100 + bblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = blight * 100 + bblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    }        
                                }
                                if(drawR){ //right{
                                    for(var jj = 0; jj < shape.right2.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right2[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right2[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right2[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right2[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right2[jj+4];
                                        punkty22.d[punkty22.o++] = rlight * 100 + rblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    }    
                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = rlight * 100 + rblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    }       
                                }
                                if(drawL) {//left
                                    for(var jj = 0; jj < shape.left2.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left2[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left2[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left2[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left2[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left2[jj+4];
                                        punkty22.d[punkty22.o++] = llight * 100 + lblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    }     
                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = llight * 100 + lblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    }     
                                }
                                if(drawD){ //bottom
                                    for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = dlight * 100 + dblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 0.3;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    }     
                                }
                                if(drawT){ //top
                                    for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = tlight * 100 + tblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    }
                                }
                            } else if(ablock.shapeType === 8){ // stairs
                                var shape = ablock.shape;
                                color = 0.0;
                                if(ablock.useBiomeColor === 1){ 
                                    color = this.getBiomeColor(x, z, 0);
                                }
                                
                                var stairsHash = "";
                                stairsHash += Chunk.cacheData[aindex];
                                if(Chunk.cacheBlock[aindex] === Chunk.cacheBlock[lindex])
                                    stairsHash += Chunk.cacheData[lindex];
                                else 
                                    stairsHash += "x";
                                if(Chunk.cacheBlock[aindex] === Chunk.cacheBlock[rindex])
                                    stairsHash += Chunk.cacheData[rindex];
                                else 
                                    stairsHash += "x";
                                if(Chunk.cacheBlock[aindex] === Chunk.cacheBlock[findex])
                                    stairsHash += Chunk.cacheData[findex];
                                else 
                                    stairsHash += "x";
                                if(Chunk.cacheBlock[aindex] === Chunk.cacheBlock[bindex])
                                    stairsHash += Chunk.cacheData[bindex];
                                else 
                                    stairsHash += "x";

                                var stairsSmall = 0;
                                var stairsPData = Chunk.stairsData[stairsHash];
                                if(stairsPData !== undefined){
                                    if(Chunk.cacheData[aindex] > 3) shape = block[blockId][9].shape;
                                    else shape = block[blockId][8].shape;
                                    stairsSmall = 1;
                                }
                                if(drawF){
                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }    
                                }//back
                                if(drawB){
                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = blight * 100 + bblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                }
                                if(drawR){ //right
                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = rlight * 100 + rblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                }
                                if(drawL){ //left
                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = llight * 100 + lblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    } 
                                }
                                if(drawD){ //bottom
                                    for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = dlight * 100 + dblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 0.3;
                                        punkty22.d[punkty22.o++] = color;
                                    } 
                                }
                                if(drawT){ //top
                                    for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = tlight * 100 + tblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    }   
                                }
                                if(stairsSmall === 1){
                                    shape = block[blockId][10].shape;
                                    //console.log(stairsPdata);
                                    var stairsx = 0;
                                    var stairsy = 0;
                                    if(Chunk.cacheData[aindex] > 3) stairsy = -0.5;
                                    var stairsz = 0;
                                    for(var ismall = 0; ismall < 4; ismall++){
                                        if(stairsPData.charCodeAt(ismall)-48 === 0) continue; 
                                        stairsx = (ismall%2)/2;
                                        if(ismall>1) stairsz = 0.5; else stairsz = 0;
                                        if(drawF){
                                            for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                                punkty22.d[punkty22.o++] = stairsx+this.xPos*16+x+shape.front[jj];
                                                punkty22.d[punkty22.o++] = stairsy+yy+y+shape.front[jj+1]; 
                                                punkty22.d[punkty22.o++] = stairsz+this.zPos*16+z+shape.front[jj+2];
                                                punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                                punkty22.d[punkty22.o++] = shape.front[jj+4];
                                                punkty22.d[punkty22.o++] = flight * 100 + fblight;
                                                punkty22.d[punkty22.o++] = selectionIndex + 1;
                                                punkty22.d[punkty22.o++] = 0.8;
                                                punkty22.d[punkty22.o++] = color;
                                            }    
                                        }//back
                                        if(drawB){
                                            for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                                punkty22.d[punkty22.o++] = stairsx+this.xPos*16+x+shape.back[jj];
                                                punkty22.d[punkty22.o++] = stairsy+yy+y+shape.back[jj+1]; 
                                                punkty22.d[punkty22.o++] = stairsz+this.zPos*16+z+shape.back[jj+2];
                                                punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                                punkty22.d[punkty22.o++] = shape.back[jj+4];
                                                punkty22.d[punkty22.o++] = blight * 100 + bblight;
                                                punkty22.d[punkty22.o++] = selectionIndex + 2;
                                                punkty22.d[punkty22.o++] = 0.8;
                                                punkty22.d[punkty22.o++] = color;
                                            }  
                                        }
                                        if(drawR){ //right
                                            for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                                punkty22.d[punkty22.o++] = stairsx+this.xPos*16+x+shape.right[jj];
                                                punkty22.d[punkty22.o++] = stairsy+yy+y+shape.right[jj+1]; 
                                                punkty22.d[punkty22.o++] = stairsz+this.zPos*16+z+shape.right[jj+2];
                                                punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                                punkty22.d[punkty22.o++] = shape.right[jj+4];
                                                punkty22.d[punkty22.o++] = rlight * 100 + rblight;
                                                punkty22.d[punkty22.o++] = selectionIndex + 3;
                                                punkty22.d[punkty22.o++] = 0.55;
                                                punkty22.d[punkty22.o++] = color;
                                            }  
                                        }
                                        if(drawL){ //left
                                            for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                                punkty22.d[punkty22.o++] = stairsx+this.xPos*16+x+shape.left[jj];
                                                punkty22.d[punkty22.o++] = stairsy+yy+y+shape.left[jj+1]; 
                                                punkty22.d[punkty22.o++] = stairsz+this.zPos*16+z+shape.left[jj+2];
                                                punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                                punkty22.d[punkty22.o++] = shape.left[jj+4];
                                                punkty22.d[punkty22.o++] = llight * 100 + lblight;
                                                punkty22.d[punkty22.o++] = selectionIndex + 4;
                                                punkty22.d[punkty22.o++] = 0.55;
                                                punkty22.d[punkty22.o++] = color;
                                            } 
                                        }
                                        if(drawD){ //bottom
                                              for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                                punkty22.d[punkty22.o++] = stairsx+this.xPos*16+x+shape.bottom[jj];
                                                punkty22.d[punkty22.o++] = stairsy+yy+y+shape.bottom[jj+1]; 
                                                punkty22.d[punkty22.o++] = stairsz+this.zPos*16+z+shape.bottom[jj+2];
                                                punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                                punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                                punkty22.d[punkty22.o++] = dlight * 100 + dblight;
                                                punkty22.d[punkty22.o++] = selectionIndex + 5;
                                                punkty22.d[punkty22.o++] = 0.3;
                                                punkty22.d[punkty22.o++] = color;
                                            } 
                                        }
                                        if(drawT){ //top
                                            for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                                punkty22.d[punkty22.o++] = stairsx+this.xPos*16+x+shape.top[jj];
                                                punkty22.d[punkty22.o++] = stairsy+yy+y+shape.top[jj+1]; 
                                                punkty22.d[punkty22.o++] = stairsz+this.zPos*16+z+shape.top[jj+2];
                                                punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                                punkty22.d[punkty22.o++] = shape.top[jj+4];
                                                punkty22.d[punkty22.o++] = tlight * 100 + tblight;
                                                punkty22.d[punkty22.o++] = selectionIndex + 6;
                                                punkty22.d[punkty22.o++] = 1.0;
                                                punkty22.d[punkty22.o++] = color;
                                            }   
                                        }
                                    }
                                }
                            } else if(ablock.shapeType === 5){ // fences
                                if(drawF || drawB || drawR || drawL || drawT || drawD) {
                                    var shape = ablock.shape;
                                    color = 0.0;
                                    if(ablock.useBiomeColor === 1){ 
                                        color = this.getBiomeColor(x, z, 0);
                                    }                                

                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        if(jj%30 === 0){
                                            if((jj === 60) || (jj === 120)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[lindex] && Chunk.cacheBlock[lindex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 30) || (jj === 90)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[rindex] && Chunk.cacheBlock[rindex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                        }
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }    

                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        if(jj%30 === 0){
                                            if((jj === 60) || (jj === 120)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[lindex] && Chunk.cacheBlock[lindex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 30) || (jj === 90)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[rindex] && Chunk.cacheBlock[rindex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                        }
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = blight * 100 + bblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }  

                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        if(jj%30 === 0){
                                            if((jj === 30) || (jj === 90)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[findex] && Chunk.cacheBlock[findex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 60) || (jj === 120)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[bindex] && Chunk.cacheBlock[bindex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                        }
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = rlight * 100 + rblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    }  

                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        if(jj%30 === 0){
                                            if((jj === 30) || (jj === 90)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[findex] && Chunk.cacheBlock[findex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 60) || (jj === 120)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[bindex] && Chunk.cacheBlock[bindex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                        }
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = llight * 100 + lblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    } 

                                    for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                        if(jj%30 === 0){
                                            if((jj === 30) || (jj === 150)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[rindex] && Chunk.cacheBlock[rindex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 60) || (jj === 180)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[lindex] && Chunk.cacheBlock[lindex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 90) || (jj === 210)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[findex] && Chunk.cacheBlock[findex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }      
                                            if((jj === 120) || (jj === 240)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[bindex] && Chunk.cacheBlock[bindex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }   
                                        }
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = dlight * 100 + dblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 0.3;
                                        punkty22.d[punkty22.o++] = color;
                                    } 

                                    for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                        if(jj%30 === 0){
                                            if((jj === 30) || (jj === 150)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[rindex] && Chunk.cacheBlock[rindex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 60) || (jj === 180)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[lindex] && Chunk.cacheBlock[lindex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }
                                            if((jj === 90) || (jj === 210)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[findex] && Chunk.cacheBlock[findex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }      
                                            if((jj === 120) || (jj === 240)){
                                                if(Chunk.cacheBlock[aindex] !== Chunk.cacheBlock[bindex] && Chunk.cacheBlock[bindex] !== 1){
                                                    jj += 25;
                                                    continue;
                                                }
                                            }   
                                        }
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = tlight * 100 + tblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    }   
                                }
                            } else if(ablock.shapeType === 6){ // no top / bottom + simple light

                                var shape = ablock.shape;
                                color = 0.0;
                                if(ablock.useBiomeColor === 1){ 
                                    color = this.getBiomeColor(x, z, 0);
                                }                                
                                if(drawF || drawB || drawR || drawL || drawD || drawT) {
                                    if(blockData === 5){
                                        for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                            punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                            punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                            punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                            punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                            punkty22.d[punkty22.o++] = shape.front[jj+4];
                                            punkty22.d[punkty22.o++] = flight * 100 + fblight;
                                            punkty22.d[punkty22.o++] = selectionIndex + 1;
                                            punkty22.d[punkty22.o++] = 0.8;
                                            punkty22.d[punkty22.o++] = color;
                                        }    
                                    }//back
                                    if(blockData === 4){
                                        for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                            punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                            punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                            punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                            punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                            punkty22.d[punkty22.o++] = shape.back[jj+4];
                                            punkty22.d[punkty22.o++] = blight * 100 + bblight;
                                            punkty22.d[punkty22.o++] = selectionIndex + 2;
                                            punkty22.d[punkty22.o++] = 0.8;
                                            punkty22.d[punkty22.o++] = color;
                                        }  
                                    }
                                    if(blockData === 3){ //right
                                        for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                            punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                            punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                            punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                            punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                            punkty22.d[punkty22.o++] = shape.right[jj+4];
                                            punkty22.d[punkty22.o++] = rlight * 100 + rblight;
                                            punkty22.d[punkty22.o++] = selectionIndex + 3;
                                            punkty22.d[punkty22.o++] = 0.55;
                                            punkty22.d[punkty22.o++] = color;
                                        }  
                                    }
                                    if(blockData === 2){ //left
                                        for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                            punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                            punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                            punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                            punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                            punkty22.d[punkty22.o++] = shape.left[jj+4];
                                            punkty22.d[punkty22.o++] = llight * 100 + lblight;
                                            punkty22.d[punkty22.o++] = selectionIndex + 4;
                                            punkty22.d[punkty22.o++] = 0.55;
                                            punkty22.d[punkty22.o++] = color;
                                        } 
                                    }
                                }
                            } else if(ablock.shapeType === 9){ // water / lava
                                var shape = ablock.shape;
                                color = 0.0;
                                if(ablock.useBiomeColor === 1){ 
                                    //if((biomes[this.cacheBiomes[(z)*18+x]].waterColor || false))
                                        color = this.getBiomeColor(x, z, 2);
                                }

                                if(drawF){
                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }    
                                }//back
                                if(drawB){
                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = blight * 100 + bblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                }
                                if(drawR){ //right
                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = rlight * 100 + rblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                }
                                if(drawL){ //left
                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = llight * 100 + lblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    } 
                                }
                                if(drawD){ //bottom
                                    for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = dlight * 100 + dblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 0.3;
                                        punkty22.d[punkty22.o++] = color;
                                    } 
                                }
                                if(drawT){ //top
                                    for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = tlight * 100 + tblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    }   
                                }
                            } else if(ablock.shapeType === 10){ // vines
                                var shape = ablock.shape;
                                color = 0.0;
                                if(ablock.useBiomeColor === 1){ 
                                    color = this.getBiomeColor(x, z, 0);
                                }
                                if(drawF || drawB || drawR || drawL || drawD || drawT) {
                                if((Chunk.cacheData[aindex] & 0x08) === 8){
                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }    
                                }//back
                                if((Chunk.cacheData[aindex] & 0x02) === 2){
                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = blight * 100 + bblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                }
                                if((Chunk.cacheData[aindex] & 0x01) === 1){
                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = rlight * 100 + rblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                }
                                if((Chunk.cacheData[aindex] & 0x04) === 4){
                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = llight * 100 + lblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    } 
                                }
                                if(Chunk.cacheBlock[tindex] === 1 || Chunk.cacheData[aindex] === 0 ){ 
                                    for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = dlight * 100 + dblight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 0.3;
                                        punkty22.d[punkty22.o++] = color;
                                    } 
                                }
                                }
                            }
                        }
               }
           }           
           
           
        } 
            
        if(punkty1[0].o>0)
            return new Float32Array(punkty1[0].d.buffer, 0, punkty1[0].o);

        return false;
    };