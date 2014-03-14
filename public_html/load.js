require("common.js");
require("webgl/webgl-utils.js");
require("webgl/gl-matrix.js");
require("webgl/gluu.js");
require("fileIO/zlib.min.js");
require("fileIO/readfile.js");
require("fileIO/NBT.js");
require("intersection3d.js");
require("camera/camera.js");
require("camera/cameraGod.js");
require("camera/cameraPlayer.js");
require("regionLib.js");
require("chunk/chunk.js");
require("chunk/chunkCache.js");
require("chunk/chunkInit.js");
require("chunk/chunkGetBuffer.js");
require("entity/mob.js");
require("entity/player.js");

    var gl;
    var gluu = new Gluu();
    var camera;
    var rchunk;
    var iChunk = 0;
    var gameRoot = "F:/mcjs";
    //var gameRoot = "mc";
    var worldName = "mcjs1";   
    //var worldName = "world";  
    var biomes;
    var mcWorld;
    var initTexture = false;
    
    var lastTime = 0;
    var firstTime = 0;
    var fps = 0;
    //var ifps = 0;
    var iLag = 0;
    var click = 0;
    var selectE = false;
    var selectT = 0;
    var selectTt = 1;
    var textDiv = null;
    var vbol;
    var vboBox;
    var vboPlayer;
    var useBlock = new Object();
    var distanceLevel = [10,10,10];
    var punkty1 = new Array();
    var sensitivity = 50;
    function start() {
        player = new Player([407,85,-128]);
        //camera = new Camera([-400,120,0],[5.5,0],[0,1,0]);
        //camera = new CameraGod([0,120,0],[5.5,0],[0,1,0]);
        //camera = new Camera([-176,90,2],[5.5,0],[0,1,0]);
        //camera = new CameraGod([-176,90,2],[5.5,0],[0,1,0]);
        
        camera = new CameraPlayer(player);
        
        //camera = new Camera([175,75,-287],[5.5,0],[0,1,0]);
        
        camera.sensitivity = sensitivity * 2;
        
        punkty1[0] = new Object();
        punkty1[1] = new Object();
        punkty1[2] = new Object();
        punkty1[0].data = new Float32Array(2000000);
        punkty1[1].data = new Float32Array(2000000);
        punkty1[2].data = new Float32Array(2000000);
        punkty1[0].offset = 0;
        punkty1[1].offset = 0;
        punkty1[2].offset = 0;

        rchunk = new Array();
        
        mcWorld = new RegionLib(gameRoot, worldName);
        
        var timeNow1 = new Date().getTime();
        firstTime = timeNow1;
        /*mcWorld.loadRegion(-2,0);
        mcWorld.loadRegion(1,-1);
        mcWorld.loadRegion(1,0);
        mcWorld.loadRegion(-1,1);
        mcWorld.loadRegion(0,1);
        mcWorld.loadRegion(0,0);
        mcWorld.loadRegion(0,-1);
        mcWorld.loadRegion(-1,0);
        mcWorld.loadRegion(-1,-1);*/
        
        var timeNow3 = new Date().getTime();
        console.log("czas "+(timeNow3-timeNow1));

        var timeNow1 = new Date().getTime();

        //for (var k in rchunk){
        //        rchunk[k].init2();
        //}
        
        var timeNow3 = new Date().getTime();
        console.log("czas "+(timeNow3-timeNow1));
        
        lastTime = new Date().getTime();
        tick();
    }

    function tick() {
        requestAnimFrame(tick);
        var timeNow = new Date().getTime();
        fps = 1000/(timeNow-lastTime);
        
        var cameraPos = camera.getPos();
        
        if(Math.floor(timeNow/100) - Math.floor(lastTime/100) > 0){
            textDiv.innerHTML = "x: "+cameraPos[0].toFixed(2)+"  y: "+cameraPos[1].toFixed(2)+"  z: "+cameraPos[2].toFixed(2);
            textDiv.innerHTML += "<br/>FPS: "+Math.floor(fps);
            textDiv.innerHTML += "<br/>Block: "+useBlock.id+"-"+
                    useBlock.data+"  : "+(block[useBlock.id][useBlock.data].name || block[useBlock.id].name || block[useBlock.id][useBlock.data].defaultTexture || ""
            );
        }
        lastTime = timeNow;

        camera.updatePosition(fps);
        
        iLag = 3;
        var selection = renderSelection();
        
        if(selectE){
            selectE = false;
            console.log("y: "+selection.y+" z: "+selection.z+" x: "+selection.x+" chx: "+selection.chx+" chz: "+selection.chz+" side: "+selection.side);
            
            switch(selectT){
                case 0:
                    var i = selection.chx*10000+selection.chz;
                    if(rchunk[i] !== undefined)
                        rchunk[i].updateBlock(selection.x,selection.y,selection.z,0,0);
                    break;
                case 1:
                    var px = 0, pz = 0, py = 0;
                    switch( selection.side){
                        case 1:
                            px = -1; break;
                        case 2:
                            px = 1; break;
                        case 3:
                            pz = -1; break;
                        case 4:
                            pz = 1; break;
                        case 5:
                            py = -1; break;
                        case 6:
                            py = 1; break;
                        case 7:  break;
                        case 8: break;
                        default: break;

                    }
                    selection.x += px; 
                    if(selection.x > 15){selection.x = 0; selection.chx++;}
                    if(selection.x < 0){selection.x = 15; selection.chx--;}
                    selection.z += pz; 
                    if(selection.z > 15){selection.z = 0; selection.chz++;}
                    if(selection.z < 0){selection.z = 15; selection.chz--;}
                    if(selection.y < 0){selection.y = 0;}
                    if(selection.y > 256){selection.y = 256;}
                    var i = selection.chx*10000+selection.chz;
                    if(rchunk[i] !== undefined){
                        var updateBlockId = useBlock.id || 1;
                        var updateBlockData = useBlock.data || 0;
                        rchunk[i].updateBlock(selection.x,selection.y+py,selection.z,updateBlockId,updateBlockData);
                    }
                    break;
                case 2:
                    var i = selection.chx*10000+selection.chz;
                    if(rchunk[i] !== undefined){
                        var updateBlockId = useBlock.id || 1;
                        var updateBlockData = useBlock.data || 0;
                        rchunk[i].updateBlock(selection.x,selection.y,selection.z,updateBlockId,updateBlockData);
                    }
                    break;
                case 3:
                    var i = selection.chx*10000+selection.chz;
                    if(rchunk[i] !== undefined){
                        rchunk[i].changeAdd(selection.x,selection.y,selection.z);
                    }
                    break;
            }
        }
        render();
        player.render();
        renderSelectBox(selection);
        renderPointer();
    }
    
    function testCollisions(){
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
                    if(rchunk[i] === -1 || rchunk[i] === -2) {
                        continue;
                    }
                    if(rchunk[i] === undefined) {
                        return true;
                    }
                    var buffer = rchunk[i].getBuffer([
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
   
    function renderSelectBox(selection){
        var shader = gluu.lineShader;
        gl.useProgram(shader);
        mat4.perspective(gluu.pMatrix, camera.fovy, gl.viewportWidth / gl.viewportHeight, 0.1, 6000.0);
        var lookAt = camera.getMatrix();
        mat4.multiply(gluu.pMatrix, gluu.pMatrix, lookAt);
        mat4.identity(gluu.mvMatrix);
        mat4.translate(gluu.mvMatrix, gluu.mvMatrix, [selection.chx*16+selection.x, selection.y, selection.chz*16+selection.z]);
        gl.uniformMatrix4fv(shader.pMatrixUniform, false, gluu.pMatrix);
        gl.uniformMatrix4fv(shader.mvMatrixUniform, false, gluu.mvMatrix);
        if(vboBox === undefined) {
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
            vboBox = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vboBox);
            gl.bufferData(gl.ARRAY_BUFFER, vtx, gl.STATIC_DRAW);
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, vboBox);
            gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 5*4, 0 );
            gl.vertexAttribPointer(shader.lightAttribute, 4, gl.FLOAT, false, 5*4, 0 );
            gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 5*4, 3*4 );
            gl.drawArrays(gl.LINES, 0, 24);
        }
    }    
    
    function renderPointer(){
        var shader = gluu.lineShader;
        gl.useProgram(shader);
        mat4.identity(gluu.mvMatrix);
        mat4.identity(gluu.pMatrix);
        gl.uniformMatrix4fv(shader.pMatrixUniform, false, gluu.pMatrix);
        gl.uniformMatrix4fv(shader.mvMatrixUniform, false, gluu.mvMatrix);
        
        if(vbol === undefined) {
            var vtx = new Float32Array(
	                [-0.03, 0.0, 0.0, 0.0, 0.0,
	                0.03, 0.0, 0.0, 0.0, 0.0,
                        0.0, -0.05, 0.0, 0.0, 0.0,
	                0.0, 0.05, 0.0, 0.0, 0.0]
	    );
            vbol = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbol);
            gl.bufferData(gl.ARRAY_BUFFER, vtx, gl.STATIC_DRAW);
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbol);
            gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 5*4, 0 );
            gl.vertexAttribPointer(shader.lightAttribute, 4, gl.FLOAT, false, 5*4, 0 );
            gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 5*4, 3*4 );
            gl.drawArrays(gl.LINES, 0, 4);
        }
    }    
    
    function render(){
        if(!initTexture) return;
        
        var shader = gluu.standardShader;
        gl.useProgram(shader);
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(1.0, 1.0, 1.0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        mat4.perspective(gluu.pMatrix, camera.fovy, gl.viewportWidth / gl.viewportHeight, 0.1, 6000.0);
        var lookAt = camera.getMatrix();
        mat4.multiply(gluu.pMatrix, gluu.pMatrix, lookAt);
        mat4.identity(gluu.mvMatrix);
        gl.uniformMatrix4fv(shader.pMatrixUniform, false, gluu.pMatrix);
        gl.uniformMatrix4fv(shader.mvMatrixUniform, false, gluu.mvMatrix);
        gl.uniform1f(shader.lod, distanceLevel[1]);
        
        var lodx = 0, lodz = 0, lod = 0;
        //var dlod = [20,23,20];
        //var dlod = [10,10,10];
        var dlod = [distanceLevel[0],distanceLevel[1],distanceLevel[2]];
        var pos = new Array();
        var xxx = 0;
        var zzz = 0;
        var i = 0;
        var level = 0;
        var cameraPos = camera.getPos();
        for(var drawLevel = 0; drawLevel < 3; drawLevel++){
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
                if(rchunk[i] === -1 || rchunk[i] === -2) {
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
                
                if(rchunk[i] === undefined) {
                    if(iLag > 1){
                       iLag -= 1;
                       mcWorld.requestChunk(xxx, zzz);
                    }
                    continue;
                }
                
                if(cameraPos[1] >= 62 || lod < 10*16 )
                    rchunk[i].renderChunk(drawLevel, shader, 0);
                
                if(cameraPos[1] < 62 && lod < 6*16 )
                    rchunk[i].renderChunk(drawLevel, shader, 1);
                else if(lod < 4*16)
                    rchunk[i].renderChunk(drawLevel, shader, 1);
            }
        }
    }

    function renderSelection(){
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
        for(var drawLevel = 0; drawLevel < 3; drawLevel++){
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
                if(rchunk[i] === -1 || rchunk[i] === -2) {
                    continue;
                }
                if(rchunk[i] === undefined) {
                    if(iLag > 1){
                       iLag -= 1;
                       mcWorld.requestChunk(xxx, zzz);
                    }
                    continue;
                }
                rchunk[i].renderChunk(drawLevel, shader, 0);
                rchunk[i].renderChunk(drawLevel, shader, 1);
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
    }

    function initTextures() {
      blockTexture = gl.createTexture();
      blockImage = new Image();
      blockImage.onload = function() { handleTextureLoaded(blockImage, blockTexture); };
      blockImage.src = "blocks.png";
    }

    function handleTextureLoaded(image, texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);
      initTexture = true;
    }

    function initBlocks() {
       texLib = JSON.parse(Readfile.readTxt('textures.json'));
       console.log(texLib);
        
       block = JSON.parse(Readfile.readTxt('blocks.json'));
       block.length = 300;
       biomes = JSON.parse(Readfile.readTxt('biomes.json'));
       
       shapeLib = JSON.parse(Readfile.readTxt('shapes.json'));
       console.log(shapeLib);
       
       texLib.texF = 1/texLib.row;
       var texx = 0, texy = 0;
       var texf = texLib.texF;
       var textureId = 0;
       
       block.lightSource = new Uint8Array(block.length);
       block.lightTransmission = new Float32Array(block.length);
       for(var i = 0; i < block.length; i++){
           if(block[i] === undefined){
               block[i] = new Object();
               block[i].type = 0;
           }
           if(block[i][0] === undefined){
               block[i][0] = new Object();
               block[i][0].type = 0;
           }
           
           block.lightSource[i] = block[i].lightSource || 0;
           if(block[i].type === 1)
                block.lightTransmission[i] = block[i].lightTransmission || 0.0;
           else
                block.lightTransmission[i] = block[i].lightTransmission || 1.0;
            
           for (var dd in block[i]){
                if(dd === "mask"){
                    block[i][dd] = parseInt(block[i][dd], 16);
                    continue;
                }
                if(block[i][dd].shapeName !== undefined){
                    block[i][dd].shape = new Object;
                    for (var k in shapeLib[block[i][dd].shapeName]){
                         block[i][dd].shape[k] = new Array();

                         if(block[i][dd][k] !== undefined){
                             textureId = texLib.texture[block[i][dd][k]];
                             texx = textureId % texLib.row;
                             texy = (textureId - texx)/texLib.row;
                         } else if(block[i][dd].defaultTexture !== undefined){
                             textureId = texLib.texture[block[i][dd].defaultTexture];
                             texx = textureId % texLib.row;
                             texy = (textureId - texx)/texLib.row;
                         }
                         block[i][dd].shape[k] = new Float32Array(shapeLib[block[i][dd].shapeName][k].length);
                         for(var j = 0; j < shapeLib[block[i][dd].shapeName][k].length; j+=5){
                             block[i][dd].shape[k][j] = shapeLib[block[i][dd].shapeName][k][j];
                             block[i][dd].shape[k][j+1] = shapeLib[block[i][dd].shapeName][k][j+1];
                             block[i][dd].shape[k][j+2] = shapeLib[block[i][dd].shapeName][k][j+2];
                             block[i][dd].shape[k][j+3] = texf*(shapeLib[block[i][dd].shapeName][k][j+3]+texx);
                             block[i][dd].shape[k][j+4] = texf*(shapeLib[block[i][dd].shapeName][k][j+4]+texy);
                         }
                         //if (shapeLib[block[i].shapeName].hasOwnProperty(k)) {
                         //     console.log("Key is " + k + ", value is" + shapeLib[block[i].shapeName][k]);
                         //}
                    }
                }           
           }
       }
       
       useBlock.id = 1;
       useBlock.data = 0;
       console.log(block);    
    }
    
    function useNextBlock(){
        if(useBlock.id === block.length - 1) useBlock.id = 0;
        while(block[++useBlock.id].type === 0){
            if(useBlock.id === block.length - 1) useBlock.id = 0;
        }
        useBlock.data = -1;
        useNextBlockData();
    }
    
    function usePrevBlock(){
        if(useBlock.id === 1) useBlock.id = block.length;
        while(block[--useBlock.id].type === 0){
            if(useBlock.id === 0) useBlock.id = block.length;
        }
        useBlock.data = -1;
        useNextBlockData();
    }
    
    function useNextBlockData(){
        for(var i = 0; i < 16; i++){
            if(block[useBlock.id][++useBlock.data] !== undefined){
                 if(block[useBlock.id][useBlock.data].shapeType !== undefined && !(block[useBlock.id][useBlock.data].hidden || false))
                    return;   
            }
            if(useBlock.data === 16) useBlock.data = -1;
        }
        useBlock.data = 0;
    }   
    
    function keyDown(e){
        camera.keyDown(e, fps);  
        var code = e.keyCode;
        switch (code) {
            case 81: // Q
                if(camera.upY === 0) camera.upY = 200;
                break;
            case 90: // Z
                useNextBlock();
                break;
            case 88: // X
                usePrevBlock();
                break;
            case 67: // C
                useNextBlockData();
                break;
            case 49: // 1
                selectTt = 0;
                break;
            case 50: // 2
                selectTt = 1;
                break;
            case 51: // 3
                selectTt = 2;
                break;
            case 52: // 4
                selectTt = 3;
                break;                
            case 70: // F
                /*var xxx = Math.floor(camera.pos[0]/16);
                var zzz = Math.floor(camera.pos[2]/16);
                mcWorld.saveChunkToStorage(xxx, zzz);*/
                textDiv.innerHTML = "Zapisywanie ...";
                mcWorld.save();
                break;    
            case 71: // G
                console.log(window.localStorage);
                /*var xxx = Math.floor(camera.pos[0]/16);
                var zzz = Math.floor(camera.pos[2]/16);
                mcWorld.loadChunkFromStorage(xxx, zzz, false);*/
                break;    
            case 77: // M
                window.localStorage.clear();
                //var timeNow3 = new Date().getTime();
                //console.log("Run time "+Math.floor((timeNow3-firstTime)/1000));
                break;    
            case 86: // V
                console.log(camera.name);
                //if(camera.name === "CameraGod") camera = new Camera(camera.getEye(),camera.rot,[0,1,0], true);
                if(camera.name === "CameraGod") camera = new CameraPlayer(player);
                else if(camera.name === "CameraPlayer") camera = new CameraGod(camera.getEye(),camera.getRot(),[0,1,0]);
                camera.sensitivity = sensitivity*2;
                break;    
            default: 
                //camera.moveBackward();
        }
    }

    function keyUp(e){
        camera.keyUp(e);
        var code = e.keyCode;
        switch (code) {
            default: 
        }
    }
    
    function mouseDown(e){
        camera.starex = e.clientX;
        camera.starey = e.clientY;
        if(camera.autoMove) selectE = true;
        if(e.button === 0) selectT = 0;
        else selectT = selectTt;
        camera.mouseDown(fps);  
    }

    function mouseUp(e){
        camera.mouseUp(fps);  
    }

    function mouseMove(e){
        var x = e.clientX;
        var y = e.clientY;
        camera.mouseMove((camera.starex-x), (camera.starey-y), fps); 
        camera.starex = x;
        camera.starey = y;
    }
    
    function pointerMove(e){
        //console.log(e);
        var movementX = e.movementX ||
            e.mozMovementX          ||
            e.webkitMovementX       ||
            0,
        movementY = e.movementY ||
            e.mozMovementY      ||
            e.webkitMovementY   ||
            0;
        //console.log(movementX + " " + movementY + " " + fps);
        //camera.mouseMove(-movementX, -movementY, fps); 
        camera.moveX -= movementX;
        camera.moveY -= movementY;
    }
    
    function mouseWheel(e) {

	// cross-browser wheel delta
	e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if(delta < 0) useNextBlock();
        else usePrevBlock();
    }
    function pointerChange(e){
        var canvas = document.getElementById("webgl");
        if (document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas ||
            document.webkitPointerLockElement === canvas) {
            window.addEventListener("mousemove", pointerMove, false);
        } else {
            canvas.onclick = canvasOn;
            window.removeEventListener("mousemove", pointerMove, false);
            camera.moveX = 0;
            camera.moveY = 0;
        }
    }
    
    function windowResize(){
        var canvas = document.getElementById("webgl");
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    }
    
    function canvasOn(){
        var canvas = document.getElementById("webgl");
        canvas.onclick = function(){};
        canvas.requestPointerLock = canvas.requestPointerLock ||
			     canvas.mozRequestPointerLock ||
			     canvas.webkitRequestPointerLock;
        canvas.requestPointerLock();
    }
    
    function webGLStart() {
        var canvas = document.getElementById("webgl");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.onresize = windowResize;
        window.addEventListener( "keydown", keyDown, false);
        window.addEventListener( "keyup", keyUp, true);
        canvas.onclick = canvasOn;
        
        document.addEventListener('pointerlockchange', pointerChange, false);
        document.addEventListener('mozpointerlockchange', pointerChange, false);
        document.addEventListener('webkitpointerlockchange', pointerChange, false);
        //window.addEventListener( "mousemove", mouseMove, true);
        window.addEventListener( "mousedown", mouseDown, true);
        window.addEventListener( "mouseup", mouseUp, true);
        window.addEventListener("mousewheel", mouseWheel, false);
	window.addEventListener("DOMMouseScroll", mouseWheel, false);
        
        textDiv = document.getElementById("text");
        
        gluu.initGL(canvas);
        
        gluu.initStandardShader();
        gluu.initLineShader();
        gluu.initSelectionShader();
        initTextures();
        initBlocks();
        
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.cullFace(gl.BACK);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);
        
        var parameters = new Object();
        window.location.search.substr(1).split("&").forEach(function(item) {parameters[item.split("=")[0]] = item.split("=")[1];});
        //console.log(parameters);
        if( parameters["worldname"] !== undefined ) worldName = parameters["worldname"];
        if( parameters["gameroot"] !== undefined ) gameRoot = parameters["gameroot"];

        if( parameters["distanceLevel"] !== undefined ){
            distanceLevel[0] = parseInt((parameters["distanceLevel"].split("-"))[0]) || distanceLevel[0]; 
            distanceLevel[1] = parseInt((parameters["distanceLevel"].split("-"))[1]) || distanceLevel[1]; 
            distanceLevel[2] = parseInt((parameters["distanceLevel"].split("-"))[2]) || distanceLevel[2]; 
            if(distanceLevel[0] < 10) distanceLevel[0] = 10;
            if(distanceLevel[1] < distanceLevel[0]) distanceLevel[1] = distanceLevel[0];
            if(distanceLevel[2] < distanceLevel[0]) distanceLevel[2] = distanceLevel[0];
            if(distanceLevel[0] > 100) distanceLevel[0] = 100;
            if(distanceLevel[1] > 100) distanceLevel[1] = 100;
            if(distanceLevel[2] > 100) distanceLevel[2] = 100;
        }
        if( parameters["sensitivity"] !== undefined ){
            sensitivity = parseInt(parameters["sensitivity"]);
            if(sensitivity < 10) sensitivity = 10;
            if(sensitivity > 100) sensitivity = 100;
        }
        console.log(distanceLevel);
        start();
    }
    
    function spiralLoop(n) {
        var r = Math.floor((Math.sqrt(n + 1) - 1) / 2) + 1;
        var p = (8 * r * (r - 1)) / 2;
        var en = r * 2;
        var a = (1 + n - p) % (r * 8);
        var pos = [0, 0, r];
        
        switch (Math.floor(a / (r * 2))) {
            case 0:
                pos[0] = a - r;
                pos[1] = -r;
                break;
            case 1:
                pos[0] = r;
                pos[1] = (a % en) - r;
                break;
            case 2:
                pos[0] = r - (a % en);
                pos[1] = r;
                break;
            case 3:
                pos[0] = -r;
                pos[1] = r - (a % en);
                break;
        }
        return pos;
    }
