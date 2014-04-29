
Chunk.prototype.init2 = function(yyyy){
        if(yyyy === 0){ 
            var yymin = 49;
            var yymax = 256;
        } else {
            var yymin = 0; 
            var yymax = 49;
        }
        
        if(this.lightPopulated === 0 && settings.lightInit){
            if(!this.refreshLight(-1, true)) return false;
            this.lightPopulated = 1;
        }

        if(!this.getCache(yymin, yymax)) return false;
        
        if(yyyy === 0){
            this.isInit = -1;
        } else {
            this.isInit1 = -1;
        }
        
        var cacheSlight = Chunk.cacheSlight;
        var cacheBlight = Chunk.cacheBlight;
        var cacheData = Chunk.cacheData;
        var cacheId = Chunk.cacheId;
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
        punkty[0].o = 0;
        punkty[1].o = 0;
        punkty[2].o = 0;
        punkty[3].o = 0;
        
           var aindex = 0, lindex = 0, rindex = 0, lindex = 0, findex = 0, bindex = 0, tindex = 0, dindex = 0;
           var selectionIndex;
           var llight = 0;
           var rlight = 0;
           var tlight = 0;
           var dlight = 0;
           var flight = 0;
           var blight = 0;
           var lBlight = 0;
           var rBlight = 0;
           var tBlight = 0;
           var dBlight = 0;
           var fBlight = 0;
           var bBlight = 0;
           var yy = 0;
           var drawD = false;
           var drawT = false;
           var drawF = false;
           var drawB = false;
           var drawL = false;
           var drawR = false;
           var color = 0, color1 = 0, color2 = 0, color3 = 0, color4 = 0;
           var modPosx, modPosz;
           var blockAdd = 0;
           
           var heightMapMax = 0;
           for(var z = 0; z < 256; z++)
                   if(this.heightMap[z] > heightMapMax) heightMapMax = this.heightMap[z];
           if(heightMapMax +1 < yymax) yymax = heightMapMax + 1;
           
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
                                   tBlight = cacheBlight[tindex];
                                   drawT = true;
                               }

                               if(dBlockType !== 1) {
                                   dlight = cacheSlight[dindex];
                                   dBlight = cacheBlight[dindex];
                                   drawD = true;
                               }
                               
                               if(rBlockType !== 1) {
                                   rlight = cacheSlight[rindex];
                                   rBlight = cacheBlight[rindex];
                                   drawR = true;
                               }

                               if(lBlockType !== 1) {
                                   llight = cacheSlight[lindex];
                                   lBlight = cacheBlight[lindex];
                                   drawL = true;
                               }
                               
                               if(fBlockType !== 1) {
                                   flight = cacheSlight[findex];
                                   fBlight = cacheBlight[findex];
                                   drawF = true;
                               }

                               if(bBlockType !== 1) {
                                   blight = cacheSlight[bindex];
                                   bBlight = cacheBlight[bindex];
                                   drawB = true;
                               }
                       } else if(blockType > 300){
                               if(tBlockType !== blockType) {
                                   tlight = cacheSlight[tindex];
                                   tBlight = cacheBlight[tindex];
                                   drawT = true;
                               }

                               if(dBlockType !== 1 && dBlockType !== blockType) {
                                   dlight = cacheSlight[dindex];
                                   dBlight = cacheBlight[dindex];
                                   drawD = true;
                               }
                               
                               if(rBlockType !== blockType) {
                                   rlight = cacheSlight[rindex];
                                   rBlight = cacheBlight[rindex];
                                   drawR = true;
                               }

                               if(lBlockType !== blockType) {
                                   llight = cacheSlight[lindex];
                                   lBlight = cacheBlight[lindex];
                                   drawL = true;
                               }
                               
                               if(fBlockType !== blockType) {
                                   flight = cacheSlight[findex];
                                   fBlight = cacheBlight[findex];
                                   drawF = true;
                               }

                               if(bBlockType !== blockType) {
                                   blight = cacheSlight[bindex];
                                   bBlight = cacheBlight[bindex];
                                   drawB = true;
                               }
                       } else if(blockType === 300){
                               if(tBlockType !== blockType || cacheData[tindex] !== cacheData[aindex]) {
                                   tlight = cacheSlight[tindex];
                                   tBlight = cacheBlight[tindex];
                                   drawT = true;
                               }

                               if(dBlockType !== 1 && dBlockType !== blockType || cacheData[dindex] !== cacheData[aindex]) {
                                   dlight = cacheSlight[dindex];
                                   dBlight = cacheBlight[dindex];
                                   drawD = true;
                               }
                               
                               if(rBlockType !== blockType || cacheData[rindex] !== cacheData[aindex]) {
                                   rlight = cacheSlight[rindex];
                                   rBlight = cacheBlight[rindex];
                                   drawR = true;
                               }

                               if(lBlockType !== blockType || cacheData[lindex] !== cacheData[aindex]) {
                                   llight = cacheSlight[lindex];
                                   lBlight = cacheBlight[lindex];
                                   drawL = true;
                               }
                               
                               if(fBlockType !== blockType || cacheData[findex] !== cacheData[aindex]) {
                                   flight = cacheSlight[findex];
                                   fBlight = cacheBlight[findex];
                                   drawF = true;
                               }

                               if(bBlockType !== blockType || cacheData[bindex] !== cacheData[aindex]) {
                                   blight = cacheSlight[bindex];
                                   bBlight = cacheBlight[bindex];
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
                       if(ablock.shapeType === 0) continue;
                       
                            if(ablock.shapeType === 1){ // simple blocks
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                var shape2 = shape;
                                color = 0.0;
                                if(ablock.useBiomeColor > 0){ 
                                    color = this.getBiomeColor(x, z, ablock.useBiomeColor-1);
                                }
                                /*if(blockAdd > 0){
                                    shape2 = block[200][blockAdd - 1].shape;
                                }*/
                                if(drawF){
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    //for(var jj = 0; jj < shape2.front.length; jj+=5 ){
                                    var f1light = Math.floor((flight+cacheSlight[findex-18]+cacheSlight[findex-324-18]+cacheSlight[findex-324])/4);
                                    var f2light = Math.floor((flight+cacheSlight[findex-324]+cacheSlight[findex-324+18]+cacheSlight[findex+18])/4);
                                    var f3light = Math.floor((flight+cacheSlight[findex+18]+cacheSlight[findex+324+18]+cacheSlight[findex+324])/4);
                                    var f4light = Math.floor((flight+cacheSlight[findex+324]+cacheSlight[findex+324-18]+cacheSlight[findex-18])/4);
                                    var f1Blight = Math.floor((fBlight+cacheBlight[findex-18]+cacheBlight[findex-324-18]+cacheBlight[findex-324])/4);
                                    var f2Blight = Math.floor((fBlight+cacheBlight[findex-324]+cacheBlight[findex-324+18]+cacheBlight[findex+18])/4);
                                    var f3Blight = Math.floor((fBlight+cacheBlight[findex+18]+cacheBlight[findex+324+18]+cacheBlight[findex+324])/4);
                                    var f4Blight = Math.floor((fBlight+cacheBlight[findex+324]+cacheBlight[findex+324-18]+cacheBlight[findex-18])/4);

                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f1light * 100 + f1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f2light * 100 + f2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f3light * 100 + f3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f1light * 100 + f1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f3light * 100 + f3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f4light * 100 + f4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    //}    
                                }//back
                                if(drawB){
                                    if(blight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    
                                    var b1light = Math.floor((blight+cacheSlight[bindex-18]+cacheSlight[bindex-324-18]+cacheSlight[bindex-324])/4);
                                    var b2light = Math.floor((blight+cacheSlight[bindex-324]+cacheSlight[bindex-324+18]+cacheSlight[bindex+18])/4);
                                    var b3light = Math.floor((blight+cacheSlight[bindex+18]+cacheSlight[bindex+324+18]+cacheSlight[bindex+324])/4);
                                    var b4light = Math.floor((blight+cacheSlight[bindex+324]+cacheSlight[bindex+324-18]+cacheSlight[bindex-18])/4);
                                    var b1Blight = Math.floor((bBlight+cacheBlight[bindex-18]+cacheBlight[bindex-324-18]+cacheBlight[bindex-324])/4);
                                    var b2Blight = Math.floor((bBlight+cacheBlight[bindex-324]+cacheBlight[bindex-324+18]+cacheBlight[bindex+18])/4);
                                    var b3Blight = Math.floor((bBlight+cacheBlight[bindex+18]+cacheBlight[bindex+324+18]+cacheBlight[bindex+324])/4);
                                    var b4Blight = Math.floor((bBlight+cacheBlight[bindex+324]+cacheBlight[bindex+324-18]+cacheBlight[bindex-18])/4);
                                    //for(var jj = 0; jj < shape2.back.length; jj+=5 ){
                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b3light * 100 + b3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b1light * 100 + b1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b4light * 100 + b4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b1light * 100 + b1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b3light * 100 + b3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b2light * 100 + b2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    //}  
                                }
                                if(drawR){ //right
                                    if(rlight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    var r1light = Math.floor((rlight+cacheSlight[rindex-1]+cacheSlight[rindex-324-1]+cacheSlight[rindex-324])/4);
                                    var r2light = Math.floor((rlight+cacheSlight[rindex-324]+cacheSlight[rindex-324+1]+cacheSlight[rindex+1])/4);
                                    var r3light = Math.floor((rlight+cacheSlight[rindex+1]+cacheSlight[rindex+324+1]+cacheSlight[rindex+324])/4);
                                    var r4light = Math.floor((rlight+cacheSlight[rindex+324]+cacheSlight[rindex+324-1]+cacheSlight[rindex-1])/4);
                                    var r1Blight = Math.floor((rBlight+cacheBlight[rindex-1]+cacheBlight[rindex-324-1]+cacheBlight[rindex-324])/4);
                                    var r2Blight = Math.floor((rBlight+cacheBlight[rindex-324]+cacheBlight[rindex-324+1]+cacheBlight[rindex+1])/4);
                                    var r3Blight = Math.floor((rBlight+cacheBlight[rindex+1]+cacheBlight[rindex+324+1]+cacheBlight[rindex+324])/4);
                                    var r4Blight = Math.floor((rBlight+cacheBlight[rindex+324]+cacheBlight[rindex+324-1]+cacheBlight[rindex-1])/4);
                                    var jj = 0;
                                    //for(var jj = 0; jj < shape2.right.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r3light * 100 + r3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r1light * 100 + r1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r4light * 100 + r4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r3light * 100 + r3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r2light * 100 + r2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r1light * 100 + r1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    //}  
                                }
                                if(drawL){ //left
                                    if(llight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    var l1light = Math.floor((llight+cacheSlight[lindex-1]+cacheSlight[lindex-324-1]+cacheSlight[lindex-324])/4);
                                    var l2light = Math.floor((llight+cacheSlight[lindex-324]+cacheSlight[lindex-324+1]+cacheSlight[lindex+1])/4);
                                    var l3light = Math.floor((llight+cacheSlight[lindex+1]+cacheSlight[lindex+324+1]+cacheSlight[lindex+324])/4);
                                    var l4light = Math.floor((llight+cacheSlight[lindex+324]+cacheSlight[lindex+324-1]+cacheSlight[lindex-1])/4);
                                    var l1Blight = Math.floor((lBlight+cacheBlight[lindex-1]+cacheBlight[lindex-324-1]+cacheBlight[lindex-324])/4);
                                    var l2Blight = Math.floor((lBlight+cacheBlight[lindex-324]+cacheBlight[lindex-324+1]+cacheBlight[lindex+1])/4);
                                    var l3Blight = Math.floor((lBlight+cacheBlight[lindex+1]+cacheBlight[lindex+324+1]+cacheBlight[lindex+324])/4);
                                    var l4Blight = Math.floor((lBlight+cacheBlight[lindex+324]+cacheBlight[lindex+324-1]+cacheBlight[lindex-1])/4);
                                    var jj = 0;
                                    //for(var jj = 0; jj < shape2.left.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l4light * 100 + l4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l1light * 100 + l1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l2light * 100 + l2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l3light * 100 + l3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l4light * 100 + l4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape2.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape2.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape2.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l2light * 100 + l2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    //} 
                                }
                                if(drawD){ //bottom
                                    punkty22 = punkty[drawLevel];
                                    //for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                    var d1light = Math.floor((dlight+cacheSlight[dindex-1]+cacheSlight[dindex-18-1]+cacheSlight[dindex-18])/4);
                                    var d2light = Math.floor((dlight+cacheSlight[dindex-18]+cacheSlight[dindex-18+1]+cacheSlight[dindex+1])/4);
                                    var d3light = Math.floor((dlight+cacheSlight[dindex+1]+cacheSlight[dindex+18+1]+cacheSlight[dindex+18])/4);
                                    var d4light = Math.floor((dlight+cacheSlight[dindex+18]+cacheSlight[dindex+18-1]+cacheSlight[dindex-1])/4);
                                    var d1Blight = Math.floor((dBlight+cacheBlight[dindex-1]+cacheBlight[dindex-18-1]+cacheBlight[dindex-18])/4);
                                    var d2Blight = Math.floor((dBlight+cacheBlight[dindex-18]+cacheBlight[dindex-18+1]+cacheBlight[dindex+1])/4);
                                    var d3Blight = Math.floor((dBlight+cacheBlight[dindex+1]+cacheBlight[dindex+18+1]+cacheBlight[dindex+18])/4);
                                    var d4Blight = Math.floor((dBlight+cacheBlight[dindex+18]+cacheBlight[dindex+18-1]+cacheBlight[dindex-1])/4);
                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d3light * 100 + d3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d1light * 100 + d1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d2light * 100 + d2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d3light * 100 + d3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d4light * 100 + d4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d1light * 100 + d1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    //}
                                }
                                if(drawT){ //top
                                    if(tlight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    //for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                    var t1light = Math.floor((tlight+cacheSlight[tindex-1]+cacheSlight[tindex-18-1]+cacheSlight[tindex-18])/4);
                                    var t2light = Math.floor((tlight+cacheSlight[tindex-18]+cacheSlight[tindex-18+1]+cacheSlight[tindex+1])/4);
                                    var t3light = Math.floor((tlight+cacheSlight[tindex+1]+cacheSlight[tindex+18+1]+cacheSlight[tindex+18])/4);
                                    var t4light = Math.floor((tlight+cacheSlight[tindex+18]+cacheSlight[tindex+18-1]+cacheSlight[tindex-1])/4);
                                    var t1Blight = Math.floor((tBlight+cacheBlight[tindex-1]+cacheBlight[tindex-18-1]+cacheBlight[tindex-18])/4);
                                    var t2Blight = Math.floor((tBlight+cacheBlight[tindex-18]+cacheBlight[tindex-18+1]+cacheBlight[tindex+1])/4);
                                    var t3Blight = Math.floor((tBlight+cacheBlight[tindex+1]+cacheBlight[tindex+18+1]+cacheBlight[tindex+18])/4);
                                    var t4Blight = Math.floor((tBlight+cacheBlight[tindex+18]+cacheBlight[tindex+18-1]+cacheBlight[tindex-1])/4);
                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t3light * 100 + t3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t2light * 100 + t2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t1light * 100 + t1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t3light * 100 + t3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t1light * 100 + t1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t4light * 100 + t4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    //}
                                }
                            } else if(ablock.shapeType === 2){ // no top / bottom
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                if(drawF) 
                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fBlight;
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
                                        punkty22.d[punkty22.o++] = blight * 100 + bBlight;
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
                                        punkty22.d[punkty22.o++] = rlight * 100 + rBlight;
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
                                        punkty22.d[punkty22.o++] = llight * 100 + lBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    }      
                            } else if(ablock.shapeType === 3){ // custom mesh
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                flight = Math.floor((flight+blight+rlight+llight+tlight)/5);
                                fBlight = Math.floor((fBlight+bBlight+rBlight+lBlight+tBlight)/5);
                                color = 0.0;
                                if(ablock.useBiomeColor > 0){ 
                                    color = this.getBiomeColor(x, z, ablock.useBiomeColor-1);
                                }
                                if(drawF || drawB || drawR || drawL) 
                                    for (var key in shape) {
                                        for(var jj = 0; jj < shape[key].length; jj+=5 ){
                                            punkty22.d[punkty22.o++] = this.xPos*16+x+shape[key][jj];
                                            punkty22.d[punkty22.o++] = yy+y+shape[key][jj+1]; 
                                            punkty22.d[punkty22.o++] = this.zPos*16+z+shape[key][jj+2];
                                            punkty22.d[punkty22.o++] = shape[key][jj+3]; 
                                            punkty22.d[punkty22.o++] = shape[key][jj+4];
                                            punkty22.d[punkty22.o++] = flight * 100 + fBlight;
                                            punkty22.d[punkty22.o++] = selectionIndex + 0;
                                            punkty22.d[punkty22.o++] = 1.0;
                                            punkty22.d[punkty22.o++] = color;
                                        }
                                    }
                            } else if(ablock.shapeType === 4){ // dirt - grass
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                if(cacheId[tindex] === 78)ablock = block[blockId][1];
                                var shape = ablock.shape;
                                
                                if(ablock.useBiomeColor > 0){
                                    color = this.getBiomeColor(x, z, ablock.useBiomeColor - 1);
                                    color1 = this.getBiomeColor1(x, z, ablock.useBiomeColor - 1);
                                    color2 = this.getBiomeColor2(x, z, ablock.useBiomeColor - 1);
                                    color3 = this.getBiomeColor3(x, z, ablock.useBiomeColor - 1);
                                    color4 = this.getBiomeColor4(x, z, ablock.useBiomeColor - 1);
                                } else {
                                    color4 = color3 = color2 = color1 = color = 0.0;
                                }
                                if(drawF) {
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    if(ablock.shapeType === 4)
                                    for(var jj = 0; jj < shape.front2.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front2[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front2[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front2[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front2[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front2[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }    
                                    //for(var jj = 0; jj < shape2.front.length; jj+=5 ){
                                    var f1light = Math.floor((flight+cacheSlight[findex-18]+cacheSlight[findex-324-18]+cacheSlight[findex-324])/4);
                                    var f2light = Math.floor((flight+cacheSlight[findex-324]+cacheSlight[findex-324+18]+cacheSlight[findex+18])/4);
                                    var f3light = Math.floor((flight+cacheSlight[findex+18]+cacheSlight[findex+324+18]+cacheSlight[findex+324])/4);
                                    var f4light = Math.floor((flight+cacheSlight[findex+324]+cacheSlight[findex+324-18]+cacheSlight[findex-18])/4);
                                    var f1Blight = Math.floor((fBlight+cacheBlight[findex-18]+cacheBlight[findex-324-18]+cacheBlight[findex-324])/4);
                                    var f2Blight = Math.floor((fBlight+cacheBlight[findex-324]+cacheBlight[findex-324+18]+cacheBlight[findex+18])/4);
                                    var f3Blight = Math.floor((fBlight+cacheBlight[findex+18]+cacheBlight[findex+324+18]+cacheBlight[findex+324])/4);
                                    var f4Blight = Math.floor((fBlight+cacheBlight[findex+324]+cacheBlight[findex+324-18]+cacheBlight[findex-18])/4);

                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f1light * 100 + f1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f2light * 100 + f2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f3light * 100 + f3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f1light * 100 + f1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f3light * 100 + f3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f4light * 100 + f4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    //}    
                                }
                                //back
                                if(drawB){
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    if(ablock.shapeType === 4)
                                    for(var jj = 0; jj < shape.back2.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back2[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back2[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back2[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back2[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back2[jj+4];
                                        punkty22.d[punkty22.o++] = blight * 100 + bBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                    var b1light = Math.floor((blight+cacheSlight[bindex-18]+cacheSlight[bindex-324-18]+cacheSlight[bindex-324])/4);
                                    var b2light = Math.floor((blight+cacheSlight[bindex-324]+cacheSlight[bindex-324+18]+cacheSlight[bindex+18])/4);
                                    var b3light = Math.floor((blight+cacheSlight[bindex+18]+cacheSlight[bindex+324+18]+cacheSlight[bindex+324])/4);
                                    var b4light = Math.floor((blight+cacheSlight[bindex+324]+cacheSlight[bindex+324-18]+cacheSlight[bindex-18])/4);
                                    var b1Blight = Math.floor((bBlight+cacheBlight[bindex-18]+cacheBlight[bindex-324-18]+cacheBlight[bindex-324])/4);
                                    var b2Blight = Math.floor((bBlight+cacheBlight[bindex-324]+cacheBlight[bindex-324+18]+cacheBlight[bindex+18])/4);
                                    var b3Blight = Math.floor((bBlight+cacheBlight[bindex+18]+cacheBlight[bindex+324+18]+cacheBlight[bindex+324])/4);
                                    var b4Blight = Math.floor((bBlight+cacheBlight[bindex+324]+cacheBlight[bindex+324-18]+cacheBlight[bindex-18])/4);
                                    //for(var jj = 0; jj < shape2.back.length; jj+=5 ){
                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b3light * 100 + b3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b1light * 100 + b1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b4light * 100 + b4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b1light * 100 + b1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b3light * 100 + b3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b2light * 100 + b2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    //}  
                                }
                                if(drawR){ //right{
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    if(ablock.shapeType === 4)
                                    for(var jj = 0; jj < shape.right2.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right2[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right2[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right2[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right2[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right2[jj+4];
                                        punkty22.d[punkty22.o++] = rlight * 100 + rBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    }    
                                    var r1light = Math.floor((rlight+cacheSlight[rindex-1]+cacheSlight[rindex-324-1]+cacheSlight[rindex-324])/4);
                                    var r2light = Math.floor((rlight+cacheSlight[rindex-324]+cacheSlight[rindex-324+1]+cacheSlight[rindex+1])/4);
                                    var r3light = Math.floor((rlight+cacheSlight[rindex+1]+cacheSlight[rindex+324+1]+cacheSlight[rindex+324])/4);
                                    var r4light = Math.floor((rlight+cacheSlight[rindex+324]+cacheSlight[rindex+324-1]+cacheSlight[rindex-1])/4);
                                    var r1Blight = Math.floor((rBlight+cacheBlight[rindex-1]+cacheBlight[rindex-324-1]+cacheBlight[rindex-324])/4);
                                    var r2Blight = Math.floor((rBlight+cacheBlight[rindex-324]+cacheBlight[rindex-324+1]+cacheBlight[rindex+1])/4);
                                    var r3Blight = Math.floor((rBlight+cacheBlight[rindex+1]+cacheBlight[rindex+324+1]+cacheBlight[rindex+324])/4);
                                    var r4Blight = Math.floor((rBlight+cacheBlight[rindex+324]+cacheBlight[rindex+324-1]+cacheBlight[rindex-1])/4);
                                    var jj = 0;
                                    //for(var jj = 0; jj < shape2.right.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r3light * 100 + r3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r1light * 100 + r1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r4light * 100 + r4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r3light * 100 + r3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r2light * 100 + r2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r1light * 100 + r1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    //}  
                                }
                                if(drawL) {//left
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    if(ablock.shapeType === 4)
                                    for(var jj = 0; jj < shape.left2.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left2[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left2[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left2[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left2[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left2[jj+4];
                                        punkty22.d[punkty22.o++] = llight * 100 + lBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    }     
                                    var l1light = Math.floor((llight+cacheSlight[lindex-1]+cacheSlight[lindex-324-1]+cacheSlight[lindex-324])/4);
                                    var l2light = Math.floor((llight+cacheSlight[lindex-324]+cacheSlight[lindex-324+1]+cacheSlight[lindex+1])/4);
                                    var l3light = Math.floor((llight+cacheSlight[lindex+1]+cacheSlight[lindex+324+1]+cacheSlight[lindex+324])/4);
                                    var l4light = Math.floor((llight+cacheSlight[lindex+324]+cacheSlight[lindex+324-1]+cacheSlight[lindex-1])/4);
                                    var l1Blight = Math.floor((lBlight+cacheBlight[lindex-1]+cacheBlight[lindex-324-1]+cacheBlight[lindex-324])/4);
                                    var l2Blight = Math.floor((lBlight+cacheBlight[lindex-324]+cacheBlight[lindex-324+1]+cacheBlight[lindex+1])/4);
                                    var l3Blight = Math.floor((lBlight+cacheBlight[lindex+1]+cacheBlight[lindex+324+1]+cacheBlight[lindex+324])/4);
                                    var l4Blight = Math.floor((lBlight+cacheBlight[lindex+324]+cacheBlight[lindex+324-1]+cacheBlight[lindex-1])/4);
                                    var jj = 0;
                                    //for(var jj = 0; jj < shape2.left.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l4light * 100 + l4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l1light * 100 + l1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l2light * 100 + l2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l3light * 100 + l3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l4light * 100 + l4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l2light * 100 + l2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    //} 
                                }
                                if(drawD){ //bottom
                                    punkty22 = punkty[drawLevel];
                                    var d1light = Math.floor((dlight+cacheSlight[dindex-1]+cacheSlight[dindex-18-1]+cacheSlight[dindex-18])/4);
                                    var d2light = Math.floor((dlight+cacheSlight[dindex-18]+cacheSlight[dindex-18+1]+cacheSlight[dindex+1])/4);
                                    var d3light = Math.floor((dlight+cacheSlight[dindex+1]+cacheSlight[dindex+18+1]+cacheSlight[dindex+18])/4);
                                    var d4light = Math.floor((dlight+cacheSlight[dindex+18]+cacheSlight[dindex+18-1]+cacheSlight[dindex-1])/4);
                                    var d1Blight = Math.floor((dBlight+cacheBlight[dindex-1]+cacheBlight[dindex-18-1]+cacheBlight[dindex-18])/4);
                                    var d2Blight = Math.floor((dBlight+cacheBlight[dindex-18]+cacheBlight[dindex-18+1]+cacheBlight[dindex+1])/4);
                                    var d3Blight = Math.floor((dBlight+cacheBlight[dindex+1]+cacheBlight[dindex+18+1]+cacheBlight[dindex+18])/4);
                                    var d4Blight = Math.floor((dBlight+cacheBlight[dindex+18]+cacheBlight[dindex+18-1]+cacheBlight[dindex-1])/4);
                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d3light * 100 + d3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d1light * 100 + d1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d2light * 100 + d2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d3light * 100 + d3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d4light * 100 + d4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d1light * 100 + d1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = 0.0;
                                    //}
                                }
                                if(drawT){ //top
                                    if(tlight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    //for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                    var t1light = Math.floor((tlight+cacheSlight[tindex-1]+cacheSlight[tindex-18-1]+cacheSlight[tindex-18])/4);
                                    var t2light = Math.floor((tlight+cacheSlight[tindex-18]+cacheSlight[tindex-18+1]+cacheSlight[tindex+1])/4);
                                    var t3light = Math.floor((tlight+cacheSlight[tindex+1]+cacheSlight[tindex+18+1]+cacheSlight[tindex+18])/4);
                                    var t4light = Math.floor((tlight+cacheSlight[tindex+18]+cacheSlight[tindex+18-1]+cacheSlight[tindex-1])/4);
                                    var t1Blight = Math.floor((tBlight+cacheBlight[tindex-1]+cacheBlight[tindex-18-1]+cacheBlight[tindex-18])/4);
                                    var t2Blight = Math.floor((tBlight+cacheBlight[tindex-18]+cacheBlight[tindex-18+1]+cacheBlight[tindex+1])/4);
                                    var t3Blight = Math.floor((tBlight+cacheBlight[tindex+1]+cacheBlight[tindex+18+1]+cacheBlight[tindex+18])/4);
                                    var t4Blight = Math.floor((tBlight+cacheBlight[tindex+18]+cacheBlight[tindex+18-1]+cacheBlight[tindex-1])/4);
                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t3light * 100 + t3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color3;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t2light * 100 + t2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color2;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t1light * 100 + t1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color1;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t3light * 100 + t3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color3;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t1light * 100 + t1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color1;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t4light * 100 + t4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color4;
                                    //}
                                }
                            } else if(ablock.shapeType === 8){ // stairs
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                color = 0.0;
                                if(ablock.useBiomeColor > 0){ 
                                    color = this.getBiomeColor(x, z, ablock.useBiomeColor-1);
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
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }    
                                }//back
                                if(drawB){
                                    if(blight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = blight * 100 + bBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                }
                                if(drawR){ //right
                                    if(rlight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = rlight * 100 + rBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                }
                                if(drawL){ //left
                                    if(llight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = llight * 100 + lBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    } 
                                }
                                if(drawD){ //bottom
                                    punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = dlight * 100 + dBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 0.3;
                                        punkty22.d[punkty22.o++] = color;
                                    } 
                                }
                                if(drawT){ //top
                                    if(tlight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = tlight * 100 + tBlight;
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
                                                punkty22.d[punkty22.o++] = stairsx+this.xPos*16+x+shape.front[jj];
                                                punkty22.d[punkty22.o++] = stairsy+yy+y+shape.front[jj+1]; 
                                                punkty22.d[punkty22.o++] = stairsz+this.zPos*16+z+shape.front[jj+2];
                                                punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                                punkty22.d[punkty22.o++] = shape.front[jj+4];
                                                punkty22.d[punkty22.o++] = flight * 100 + fBlight;
                                                punkty22.d[punkty22.o++] = selectionIndex + 1;
                                                punkty22.d[punkty22.o++] = 0.8;
                                                punkty22.d[punkty22.o++] = color;
                                            }    
                                        }//back
                                        if(drawB){
                                            if(blight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                            else punkty22 = punkty[drawLevel];
                                            for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                                punkty22.d[punkty22.o++] = stairsx+this.xPos*16+x+shape.back[jj];
                                                punkty22.d[punkty22.o++] = stairsy+yy+y+shape.back[jj+1]; 
                                                punkty22.d[punkty22.o++] = stairsz+this.zPos*16+z+shape.back[jj+2];
                                                punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                                punkty22.d[punkty22.o++] = shape.back[jj+4];
                                                punkty22.d[punkty22.o++] = blight * 100 + bBlight;
                                                punkty22.d[punkty22.o++] = selectionIndex + 2;
                                                punkty22.d[punkty22.o++] = 0.8;
                                                punkty22.d[punkty22.o++] = color;
                                            }  
                                        }
                                        if(drawR){ //right
                                            if(rlight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                            else punkty22 = punkty[drawLevel];
                                            for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                                punkty22.d[punkty22.o++] = stairsx+this.xPos*16+x+shape.right[jj];
                                                punkty22.d[punkty22.o++] = stairsy+yy+y+shape.right[jj+1]; 
                                                punkty22.d[punkty22.o++] = stairsz+this.zPos*16+z+shape.right[jj+2];
                                                punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                                punkty22.d[punkty22.o++] = shape.right[jj+4];
                                                punkty22.d[punkty22.o++] = rlight * 100 + rBlight;
                                                punkty22.d[punkty22.o++] = selectionIndex + 3;
                                                punkty22.d[punkty22.o++] = 0.55;
                                                punkty22.d[punkty22.o++] = color;
                                            }  
                                        }
                                        if(drawL){ //left
                                            if(llight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                            else punkty22 = punkty[drawLevel];
                                            for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                                punkty22.d[punkty22.o++] = stairsx+this.xPos*16+x+shape.left[jj];
                                                punkty22.d[punkty22.o++] = stairsy+yy+y+shape.left[jj+1]; 
                                                punkty22.d[punkty22.o++] = stairsz+this.zPos*16+z+shape.left[jj+2];
                                                punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                                punkty22.d[punkty22.o++] = shape.left[jj+4];
                                                punkty22.d[punkty22.o++] = llight * 100 + lBlight;
                                                punkty22.d[punkty22.o++] = selectionIndex + 4;
                                                punkty22.d[punkty22.o++] = 0.55;
                                                punkty22.d[punkty22.o++] = color;
                                            } 
                                        }
                                        if(drawD){ //bottom
                                            punkty22 = punkty[drawLevel];
                                            for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                                punkty22.d[punkty22.o++] = stairsx+this.xPos*16+x+shape.bottom[jj];
                                                punkty22.d[punkty22.o++] = stairsy+yy+y+shape.bottom[jj+1]; 
                                                punkty22.d[punkty22.o++] = stairsz+this.zPos*16+z+shape.bottom[jj+2];
                                                punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                                punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                                punkty22.d[punkty22.o++] = dlight * 100 + dBlight;
                                                punkty22.d[punkty22.o++] = selectionIndex + 5;
                                                punkty22.d[punkty22.o++] = 0.3;
                                                punkty22.d[punkty22.o++] = color;
                                            } 
                                        }
                                        if(drawT){ //top
                                            if(tlight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                            else punkty22 = punkty[drawLevel];
                                            for(var jj = 0; jj < shape.top.length; jj+=5 ){
                                                punkty22.d[punkty22.o++] = stairsx+this.xPos*16+x+shape.top[jj];
                                                punkty22.d[punkty22.o++] = stairsy+yy+y+shape.top[jj+1]; 
                                                punkty22.d[punkty22.o++] = stairsz+this.zPos*16+z+shape.top[jj+2];
                                                punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                                punkty22.d[punkty22.o++] = shape.top[jj+4];
                                                punkty22.d[punkty22.o++] = tlight * 100 + tBlight;
                                                punkty22.d[punkty22.o++] = selectionIndex + 6;
                                                punkty22.d[punkty22.o++] = 1.0;
                                                punkty22.d[punkty22.o++] = color;
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
                                    if(ablock.useBiomeColor > 0){ 
                                        color = this.getBiomeColor(x, z, ablock.useBiomeColor-1);
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
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
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
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = blight * 100 + bBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
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
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = rlight * 100 + rBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
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
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = llight * 100 + lBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
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
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = dlight * 100 + dBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 0.3;
                                        punkty22.d[punkty22.o++] = color;
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
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = tlight * 100 + tBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    }   
                                }
                            } else if(ablock.shapeType === 6){ // no top / bottom + simple light
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                color = 0.0;
                                if(ablock.useBiomeColor > 0){ 
                                    color = this.getBiomeColor(x, z, ablock.useBiomeColor-1);
                                }                                
                                if(drawF || drawB || drawR || drawL || drawD || drawT) {
                                    if(blockData === 5){
                                        if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                        else punkty22 = punkty[drawLevel];
                                        for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                            punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                            punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                            punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                            punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                            punkty22.d[punkty22.o++] = shape.front[jj+4];
                                            punkty22.d[punkty22.o++] = flight * 100 + fBlight;
                                            punkty22.d[punkty22.o++] = selectionIndex + 1;
                                            punkty22.d[punkty22.o++] = 0.8;
                                            punkty22.d[punkty22.o++] = color;
                                        }    
                                    }//back
                                    if(blockData === 4){
                                        if(blight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                        else punkty22 = punkty[drawLevel];
                                        for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                            punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                            punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                            punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                            punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                            punkty22.d[punkty22.o++] = shape.back[jj+4];
                                            punkty22.d[punkty22.o++] = blight * 100 + bBlight;
                                            punkty22.d[punkty22.o++] = selectionIndex + 2;
                                            punkty22.d[punkty22.o++] = 0.8;
                                            punkty22.d[punkty22.o++] = color;
                                        }  
                                    }
                                    if(blockData === 3){ //right
                                        if(rlight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                        else punkty22 = punkty[drawLevel];
                                        for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                            punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                            punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                            punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                            punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                            punkty22.d[punkty22.o++] = shape.right[jj+4];
                                            punkty22.d[punkty22.o++] = rlight * 100 + rBlight;
                                            punkty22.d[punkty22.o++] = selectionIndex + 3;
                                            punkty22.d[punkty22.o++] = 0.55;
                                            punkty22.d[punkty22.o++] = color;
                                        }  
                                    }
                                    if(blockData === 2){ //left
                                        if(llight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                        else punkty22 = punkty[drawLevel];
                                        for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                            punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                            punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                            punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                            punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                            punkty22.d[punkty22.o++] = shape.left[jj+4];
                                            punkty22.d[punkty22.o++] = llight * 100 + lBlight;
                                            punkty22.d[punkty22.o++] = selectionIndex + 4;
                                            punkty22.d[punkty22.o++] = 0.55;
                                            punkty22.d[punkty22.o++] = color;
                                        } 
                                    }
                                }
                            } else if(ablock.shapeType === 9){ // water / lava
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                color = 0.0;
                                if(ablock.useBiomeColor > 0){
                                    color = this.getBiomeColor(x, z, ablock.useBiomeColor - 1);
                                    color1 = this.getBiomeColor1(x, z, ablock.useBiomeColor - 1);
                                    color2 = this.getBiomeColor2(x, z, ablock.useBiomeColor - 1);
                                    color3 = this.getBiomeColor3(x, z, ablock.useBiomeColor - 1);
                                    color4 = this.getBiomeColor4(x, z, ablock.useBiomeColor - 1);
                                } else {
                                    color4 = color3 = color2 = color1 = color = 0.0;
                                }
                                //tBlockType !== blockType || cacheData[tindex] !== cacheData[aindex]
                                var height1 = 1.0;
                                var height2 = 1.0;
                                var height3 = 1.0;
                                var height4 = 1.0;          
                                if((cacheData[aindex] & 0x08) !== 8 && tBlockType !== blockType){
                                    if((cacheData[aindex] & 0x07) !== 0){
                                    var lwl = cacheData[aindex + 18] % 8; if(lBlockType !== blockType) lwl = 7;
                                    var rwl = cacheData[aindex - 18] % 8; if(rBlockType !== blockType) rwl = 7;
                                    var fwl = cacheData[aindex - 1] % 8; if(fBlockType !== blockType) fwl = 7;
                                    var bwl = cacheData[aindex + 1] % 8; if(bBlockType !== blockType) bwl = 7;
                                    var lfwl = cacheData[aindex + 18 - 1] % 8; if(block[cacheId[aindex + 18 - 1]].type !== blockType) lfwl = 7;
                                    var rfwl = cacheData[aindex - 18 - 1] % 8; if(block[cacheId[aindex - 18 - 1]].type !== blockType) rfwl = 7;
                                    var lbwl = cacheData[aindex + 18 + 1] % 8; if(block[cacheId[aindex + 18 + 1]].type !== blockType) lbwl = 7;
                                    var rbwl = cacheData[aindex - 18 + 1] % 8; if(block[cacheId[aindex - 18 + 1]].type !== blockType) rbwl = 7;
                                    if(fwl === 0 || rfwl === 0 || rwl === 0 )
                                        height1 = 0.875;  
                                    else
                                        height1 = height1 - ((cacheData[aindex]+fwl+rfwl+rwl)/4)/7;
                                    if(rwl === 0 || rbwl === 0 || bwl === 0 )
                                        height2 = 0.875;  
                                    else
                                        height2 = height2 - ((cacheData[aindex]+rwl+rbwl+bwl)/4)/7;
                                    if(bwl === 0 || lbwl === 0 || lwl === 0 )
                                        height3 = 0.875;  
                                    else
                                        height3 = height3 - ((cacheData[aindex]+bwl+lbwl+lwl)/4)/7;
                                    if(lwl === 0 || lfwl === 0 || fwl === 0 )
                                        height4 = 0.875;  
                                    else
                                        height4 = height4 - ((cacheData[aindex]+lwl+lfwl+fwl)/4)/7;
                                    
                                    if(height1+height2+height3 === 2.625 || height2+height3+height4 === 2.625 ||
                                        height3+height4+height1 === 2.625 || height4+height1+height2 === 2.625){
                                            height1 = 0.875; height2 = 0.875; height3 = 0.875; height4 = 0.875;  
                                        }
                                    } else {
                                        height1 = 0.875; height2 = 0.875; height3 = 0.875; height4 = 0.875;  
                                    }    
                                    if(block[cacheId[tindex - 1]].type === blockType || block[cacheId[tindex - 18 - 1]].type === blockType || block[cacheId[tindex - 18]].type === blockType) height1 = 1.0;
                                    if(block[cacheId[tindex - 18]].type === blockType || block[cacheId[tindex - 18 + 1]].type === blockType || block[cacheId[tindex + 1]].type === blockType) height2 = 1.0;
                                    if(block[cacheId[tindex + 1]].type === blockType || block[cacheId[tindex + 18 + 1]].type === blockType || block[cacheId[tindex + 18]].type === blockType) height3 = 1.0;
                                    if(block[cacheId[tindex + 18]].type === blockType || block[cacheId[tindex + 18 - 1]].type === blockType || block[cacheId[tindex - 1]].type === blockType) height4 = 1.0;

                                }

                                if(drawF){
                                    var f1light = Math.floor((flight+cacheSlight[findex-18]+cacheSlight[findex-324-18]+cacheSlight[findex-324])/4);
                                    var f2light = Math.floor((flight+cacheSlight[findex-324]+cacheSlight[findex-324+18]+cacheSlight[findex+18])/4);
                                    var f3light = Math.floor((flight+cacheSlight[findex+18]+cacheSlight[findex+324+18]+cacheSlight[findex+324])/4);
                                    var f4light = Math.floor((flight+cacheSlight[findex+324]+cacheSlight[findex+324-18]+cacheSlight[findex-18])/4);
                                    var f1Blight = Math.floor((fBlight+cacheBlight[findex-18]+cacheBlight[findex-324-18]+cacheBlight[findex-324])/4);
                                    var f2Blight = Math.floor((fBlight+cacheBlight[findex-324]+cacheBlight[findex-324+18]+cacheBlight[findex+18])/4);
                                    var f3Blight = Math.floor((fBlight+cacheBlight[findex+18]+cacheBlight[findex+324+18]+cacheBlight[findex+324])/4);
                                    var f4Blight = Math.floor((fBlight+cacheBlight[findex+324]+cacheBlight[findex+324-18]+cacheBlight[findex-18])/4);

                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]*height1; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f1light * 100 + f1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]*height4; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f2light * 100 + f2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]*height4; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f3light * 100 + f3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]*height1; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f1light * 100 + f1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]*height4; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f3light * 100 + f3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]*height1; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = f4light * 100 + f4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    //}    
                                }//back
                                if(drawB){
                                    var b1light = Math.floor((blight+cacheSlight[bindex-18]+cacheSlight[bindex-324-18]+cacheSlight[bindex-324])/4);
                                    var b2light = Math.floor((blight+cacheSlight[bindex-324]+cacheSlight[bindex-324+18]+cacheSlight[bindex+18])/4);
                                    var b3light = Math.floor((blight+cacheSlight[bindex+18]+cacheSlight[bindex+324+18]+cacheSlight[bindex+324])/4);
                                    var b4light = Math.floor((blight+cacheSlight[bindex+324]+cacheSlight[bindex+324-18]+cacheSlight[bindex-18])/4);
                                    var b1Blight = Math.floor((bBlight+cacheBlight[bindex-18]+cacheBlight[bindex-324-18]+cacheBlight[bindex-324])/4);
                                    var b2Blight = Math.floor((bBlight+cacheBlight[bindex-324]+cacheBlight[bindex-324+18]+cacheBlight[bindex+18])/4);
                                    var b3Blight = Math.floor((bBlight+cacheBlight[bindex+18]+cacheBlight[bindex+324+18]+cacheBlight[bindex+324])/4);
                                    var b4Blight = Math.floor((bBlight+cacheBlight[bindex+324]+cacheBlight[bindex+324-18]+cacheBlight[bindex-18])/4);

                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]*height3; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b3light * 100 + b3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]*height2; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b1light * 100 + b1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]*height2; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b4light * 100 + b4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]*height2; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b1light * 100 + b1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]*height3; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b3light * 100 + b3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]*height3; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = b2light * 100 + b2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    //}  
                                }
                                if(drawR){ //right
                                    var r1light = Math.floor((rlight+cacheSlight[rindex-1]+cacheSlight[rindex-324-1]+cacheSlight[rindex-324])/4);
                                    var r2light = Math.floor((rlight+cacheSlight[rindex-324]+cacheSlight[rindex-324+1]+cacheSlight[rindex+1])/4);
                                    var r3light = Math.floor((rlight+cacheSlight[rindex+1]+cacheSlight[rindex+324+1]+cacheSlight[rindex+324])/4);
                                    var r4light = Math.floor((rlight+cacheSlight[rindex+324]+cacheSlight[rindex+324-1]+cacheSlight[rindex-1])/4);
                                    var r1Blight = Math.floor((rBlight+cacheBlight[rindex-1]+cacheBlight[rindex-324-1]+cacheBlight[rindex-324])/4);
                                    var r2Blight = Math.floor((rBlight+cacheBlight[rindex-324]+cacheBlight[rindex-324+1]+cacheBlight[rindex+1])/4);
                                    var r3Blight = Math.floor((rBlight+cacheBlight[rindex+1]+cacheBlight[rindex+324+1]+cacheBlight[rindex+324])/4);
                                    var r4Blight = Math.floor((rBlight+cacheBlight[rindex+324]+cacheBlight[rindex+324-1]+cacheBlight[rindex-1])/4);
                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]*height2; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r3light * 100 + r3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]*height1; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r1light * 100 + r1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]*height1; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r4light * 100 + r4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]*height2;  
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r3light * 100 + r3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]*height2; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r2light * 100 + r2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]*height1; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = r1light * 100 + r1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    //}  
                                }
                                if(drawL){ //left
                                    var l1light = Math.floor((llight+cacheSlight[lindex-1]+cacheSlight[lindex-324-1]+cacheSlight[lindex-324])/4);
                                    var l2light = Math.floor((llight+cacheSlight[lindex-324]+cacheSlight[lindex-324+1]+cacheSlight[lindex+1])/4);
                                    var l3light = Math.floor((llight+cacheSlight[lindex+1]+cacheSlight[lindex+324+1]+cacheSlight[lindex+324])/4);
                                    var l4light = Math.floor((llight+cacheSlight[lindex+324]+cacheSlight[lindex+324-1]+cacheSlight[lindex-1])/4);
                                    var l1Blight = Math.floor((lBlight+cacheBlight[lindex-1]+cacheBlight[lindex-324-1]+cacheBlight[lindex-324])/4);
                                    var l2Blight = Math.floor((lBlight+cacheBlight[lindex-324]+cacheBlight[lindex-324+1]+cacheBlight[lindex+1])/4);
                                    var l3Blight = Math.floor((lBlight+cacheBlight[lindex+1]+cacheBlight[lindex+324+1]+cacheBlight[lindex+324])/4);
                                    var l4Blight = Math.floor((lBlight+cacheBlight[lindex+324]+cacheBlight[lindex+324-1]+cacheBlight[lindex-1])/4);
                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]*height4; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l4light * 100 + l4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]*height4; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l1light * 100 + l1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]*height3; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l2light * 100 + l2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]*height3; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l3light * 100 + l3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]*height4; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l4light * 100 + l4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]*height3; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = l2light * 100 + l2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    //} 
                                }
                                if(drawD){ //bottom
                                    var d1light = Math.floor((dlight+cacheSlight[dindex-1]+cacheSlight[dindex-18-1]+cacheSlight[dindex-18])/4);
                                    var d2light = Math.floor((dlight+cacheSlight[dindex-18]+cacheSlight[dindex-18+1]+cacheSlight[dindex+1])/4);
                                    var d3light = Math.floor((dlight+cacheSlight[dindex+1]+cacheSlight[dindex+18+1]+cacheSlight[dindex+18])/4);
                                    var d4light = Math.floor((dlight+cacheSlight[dindex+18]+cacheSlight[dindex+18-1]+cacheSlight[dindex-1])/4);
                                    var d1Blight = Math.floor((dBlight+cacheBlight[dindex-1]+cacheBlight[dindex-18-1]+cacheBlight[dindex-18])/4);
                                    var d2Blight = Math.floor((dBlight+cacheBlight[dindex-18]+cacheBlight[dindex-18+1]+cacheBlight[dindex+1])/4);
                                    var d3Blight = Math.floor((dBlight+cacheBlight[dindex+1]+cacheBlight[dindex+18+1]+cacheBlight[dindex+18])/4);
                                    var d4Blight = Math.floor((dBlight+cacheBlight[dindex+18]+cacheBlight[dindex+18-1]+cacheBlight[dindex-1])/4);
                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d3light * 100 + d3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d1light * 100 + d1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d2light * 100 + d2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d3light * 100 + d3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d4light * 100 + d4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = d1light * 100 + d1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 5;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color;
                                    //}
                                }
                                if(drawT){ //top
                                    var t1light = Math.floor((tlight+cacheSlight[tindex-1]+cacheSlight[tindex-18-1]+cacheSlight[tindex-18])/4);
                                    var t2light = Math.floor((tlight+cacheSlight[tindex-18]+cacheSlight[tindex-18+1]+cacheSlight[tindex+1])/4);
                                    var t3light = Math.floor((tlight+cacheSlight[tindex+1]+cacheSlight[tindex+18+1]+cacheSlight[tindex+18])/4);
                                    var t4light = Math.floor((tlight+cacheSlight[tindex+18]+cacheSlight[tindex+18-1]+cacheSlight[tindex-1])/4);
                                    var t1Blight = Math.floor((tBlight+cacheBlight[tindex-1]+cacheBlight[tindex-18-1]+cacheBlight[tindex-18])/4);
                                    var t2Blight = Math.floor((tBlight+cacheBlight[tindex-18]+cacheBlight[tindex-18+1]+cacheBlight[tindex+1])/4);
                                    var t3Blight = Math.floor((tBlight+cacheBlight[tindex+1]+cacheBlight[tindex+18+1]+cacheBlight[tindex+18])/4);
                                    var t4Blight = Math.floor((tBlight+cacheBlight[tindex+18]+cacheBlight[tindex+18-1]+cacheBlight[tindex-1])/4);
                                    var jj = 0;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]*height3;
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t3light * 100 + t3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color3;
                                    jj = 5;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]*height2; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t2light * 100 + t2Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color2;
                                    jj = 10;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]*height1; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t1light * 100 + t1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color1;
                                    jj = 15;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]*height3; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t3light * 100 + t3Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color3;
                                    jj = 20;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]*height1; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t1light * 100 + t1Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color1;
                                    jj = 25;
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.top[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.top[jj+1]*height4; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.top[jj+2];
                                        punkty22.d[punkty22.o++] = shape.top[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.top[jj+4];
                                        punkty22.d[punkty22.o++] = t4light * 100 + t4Blight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 6;
                                        punkty22.d[punkty22.o++] = 1.0;
                                        punkty22.d[punkty22.o++] = color4;
                                }
                            } else if(ablock.shapeType === 10){ // vines
                                drawLevel = ablock.drawLevel;
                                punkty22 = punkty[drawLevel];
                                var shape = ablock.shape;
                                color = 0.0;
                                if(ablock.useBiomeColor > 0){ 
                                    color = this.getBiomeColor(x, z, ablock.useBiomeColor-1);
                                }
                                if(drawF || drawB || drawR || drawL || drawD || drawT) {
                                if((cacheData[aindex] & 0x08) === 8){
                                    if(flight > 8 && drawLevel === 0 ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.front.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.front[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.front[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.front[jj+2];
                                        punkty22.d[punkty22.o++] = shape.front[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.front[jj+4];
                                        punkty22.d[punkty22.o++] = flight * 100 + fBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 1;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }    
                                }//back
                                if((cacheData[aindex] & 0x02) === 2){
                                    if(blight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.back.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.back[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.back[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.back[jj+2];
                                        punkty22.d[punkty22.o++] = shape.back[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.back[jj+4];
                                        punkty22.d[punkty22.o++] = blight * 100 + bBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 2;
                                        punkty22.d[punkty22.o++] = 0.8;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                }
                                if((cacheData[aindex] & 0x01) === 1){
                                    if(rlight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.right.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.right[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.right[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.right[jj+2];
                                        punkty22.d[punkty22.o++] = shape.right[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.right[jj+4];
                                        punkty22.d[punkty22.o++] = rlight * 100 + rBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 3;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    }  
                                }
                                if((cacheData[aindex] & 0x04) === 4){
                                    if(llight > 8 && drawLevel === 0  ) punkty22 = punkty[drawLevel+1];
                                    else punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.left.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.left[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.left[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.left[jj+2];
                                        punkty22.d[punkty22.o++] = shape.left[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.left[jj+4];
                                        punkty22.d[punkty22.o++] = llight * 100 + lBlight;
                                        punkty22.d[punkty22.o++] = selectionIndex + 4;
                                        punkty22.d[punkty22.o++] = 0.55;
                                        punkty22.d[punkty22.o++] = color;
                                    } 
                                }
                                if(tBlockType === 1 || cacheData[aindex] === 0 ){ 
                                    punkty22 = punkty[drawLevel];
                                    for(var jj = 0; jj < shape.bottom.length; jj+=5 ){
                                        punkty22.d[punkty22.o++] = this.xPos*16+x+shape.bottom[jj];
                                        punkty22.d[punkty22.o++] = yy+y+shape.bottom[jj+1]; 
                                        punkty22.d[punkty22.o++] = this.zPos*16+z+shape.bottom[jj+2];
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+3]; 
                                        punkty22.d[punkty22.o++] = shape.bottom[jj+4];
                                        punkty22.d[punkty22.o++] = dlight * 100 + dBlight;
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
           
           
        //} 

        if(this.vbo !== undefined){
            if(yyyy === 0 && this.vbo[0] !== undefined){
                this.vbo[0].forEach(function(e) {
                    gl.deleteBuffer(e);
                });
                this.ivbo[0].forEach(function(e) {
                    gpuMem -= e;
                });
            }
        
            if(yyyy === 1 && this.vbo[1] !== undefined){
                this.vbo[1].forEach(function(e) {
                    gl.deleteBuffer(e);
                });
                this.ivbo[1].forEach(function(e) {
                    gpuMem -= e;
                });
            }
        }
            
        //this.ivbo = new Array();
        //this.vbo = new Array();
        if(yyyy === 0){
            this.ivbo[0] = new Array();
            this.vbo[0] = new Array();

            for(var i = 0; i < 4; i++){
               if(punkty[i].o>0){
                   //if(punkty[i].offset>10) console.log(i+" "+punkty[i].offset);
                   var tpunkty = new Float32Array(punkty[i].d.buffer, 0, punkty[i].o);
                   this.ivbo[0][i] = tpunkty.length;
                   this.vbo[0][i] = gl.createBuffer();
                   gpuMem += tpunkty.length;
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
            
            for(var i = 0; i < 4; i++){
               if(punkty[i].o>0){
                   //if(punkty[i].offset>10) console.log(i+" "+punkty[i].offset);
                   var tpunkty = new Float32Array(punkty[i].d.buffer, 0, punkty[i].o);
                   this.ivbo[1][i] = tpunkty.length;
                   this.vbo[1][i] = gl.createBuffer();
                   gpuMem += tpunkty.length;
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
