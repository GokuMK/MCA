require("common.js");
require("settings.js");
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
require("ui/pointer.js");
require("ui/selectionBox.js");

    var gl;
    var gluu = new Gluu();
    var glCanvas, lastTarget = false;
    var codeEditor = null;
    var settings = new Settings();
    var biomes;
    var mcWorld;
    var block;
    var blockTexture;
    var blockSelection;
    var camera;
    var initTexture = false;
    
    var gpuMem = 0;
    var lastTime = 0;
    var firstTime = 0;
    var fps = 0;
    var newSec = false;
    var sec = 0;
    var iLag = 0;
    var click = 0;
    var selectE = false;
    var selectT = 0;
    var selectTt = 1;
    var textDiv = null;
    var useBlock = new Object();
    var punkty1 = new Array();
    var pointer = new Pointer();
    var selectBox = new SelectionBox();

    function tick() {
        requestAnimFrame(tick);
        var timeNow = new Date().getTime();
        fps = 1000/(timeNow-lastTime);
        
        var cameraPos = camera.getPos();
        var cameraRot = camera.getRot();
        
        if(Math.floor(timeNow/100) - Math.floor(lastTime/100) > 0){
            textDiv.innerHTML = "x: "+cameraPos[0].toFixed(2)+"  y: "+cameraPos[1].toFixed(2)+"  z: "+cameraPos[2].toFixed(2);
            textDiv.innerHTML += "<br/>FPS: "+Math.floor(fps);
            textDiv.innerHTML += "<br/>Block: "+useBlock.id+"-"+
                    useBlock.data+"  : "+(block[useBlock.id][useBlock.data].name || block[useBlock.id].name || block[useBlock.id][useBlock.data].defaultTexture || ""
            );
            textDiv.innerHTML += "<br/>Est. Gpu Mem: "+Math.floor((gpuMem*8)/(1024*1024))+" M";    
        }
        newSec = false;
        if(lastTime%1000 > timeNow%1000){
            newSec = true;
            sec++;
        }
        var new100msec = false;
        if(lastTime%100 > timeNow%100){
            new100msec = true;
        }
        lastTime = timeNow;
        camera.updatePosition(fps);
        
        iLag += settings.loadSpeed;
        if(iLag > settings.loadLag)
            iLag = settings.loadLag;
        
        if(settings.edit){
        if(new100msec) blockSelection = mcWorld.renderSelection();    
        if(selectE){
            var selection = blockSelection;
            selectE = false;
            console.log("y: "+selection.y+" z: "+selection.z+" x: "+selection.x+" chx: "+selection.chx+" chz: "+selection.chz+" side: "+selection.side);
            
            switch(selectT){
                case 0:
                    mcWorld.updateChunkBlock(selection.chx,selection.chz,selection.x,selection.y,selection.z,0,0);
                    break;
                case 1:
                    var px = 0, pz = 0, py = 0;
                    var selectedBlock = mcWorld.getChunkBlock(selection.chx,selection.chz,selection.x,selection.y,selection.z);
                    console.log(selectedBlock.id+" "+selectedBlock.data);
                    var replace = false;
                    if(block[selectedBlock.id][selectedBlock.data] & block[selectedBlock.id].mask !== undefined) 
                        if(block[selectedBlock.id][selectedBlock.data].replace !== undefined) 
                            replace = block[selectedBlock.id][selectedBlock.data].replace;
                    else if(block[selectedBlock.id].replace !== undefined) 
                        replace = block[selectedBlock.id].replace;
                    
                    if(!replace)
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
                    var updateBlockId = useBlock.id || 1;
                    var updateBlockData = useBlock.data || 0;
                    mcWorld.updateChunkBlock(selection.chx,selection.chz,selection.x,selection.y+py,selection.z,updateBlockId,updateBlockData);
                    break;
                case 2:
                    var updateBlockId = useBlock.id || 1;
                    var updateBlockData = useBlock.data || 0;
                    mcWorld.updateChunkBlock(selection.chx,selection.chz,selection.x,selection.y,selection.z,updateBlockId,updateBlockData);
                    break;
                case 3:
                    mcWorld.changeChunkBlockAdd(selection.chx,selection.chz,selection.x,selection.y,selection.z);
                    break;
            }
        }
        }
        
        mcWorld.render();
        //player.render();
        
        if(settings.edit) {
            selectBox.render(blockSelection);
            pointer.render();
        }
        
        if(newSec){
           window.location.hash =
                   "pos="+cameraPos[0].toFixed(2)+"+"+cameraPos[1].toFixed(2)+"+"+cameraPos[2].toFixed(2)
                   +"&rot="+cameraRot[0].toFixed(2)+"+"+cameraRot[1].toFixed(2)
                   +"&camera="+camera.name;
        }
        
        if(sec === 10){
            sec = 0;
            mcWorld.deleteBuffers();
        }
    }

    function initTextures() {
      blockTexture = gl.createTexture();
      var blockImage = new Image();
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
    
    function useNextBlock(useBlock){
        if(useBlock.id === block.length - 1) useBlock.id = 0;
        while(block[++useBlock.id].type === 0){
            if(useBlock.id === block.length - 1) useBlock.id = 0;
        }
        useBlock.data = -1;
        useNextBlockData(useBlock);
    }
    
    function usePrevBlock(useBlock){
        if(useBlock.id === 1) useBlock.id = block.length;
        while(block[--useBlock.id].type === 0){
            if(useBlock.id === 0) useBlock.id = block.length;
        }
        useBlock.data = -1;
        useNextBlockData(useBlock);
    }
    
    function useNextBlockData(useBlock){
        for(var i = 0; i < 16; i++){
            if(block[useBlock.id][++useBlock.data] !== undefined){
                 if(block[useBlock.id][useBlock.data].shapeType !== undefined && !(block[useBlock.id][useBlock.data].hidden || false))
                    return ;   
            }
            if(useBlock.data === 16) useBlock.data = -1;
        }
        useBlock.data = 0;
    }   
    
    function keyDown(e){
        if(lastTarget === glCanvas){
            camera.keyDown(e, fps);  
            var code = e.keyCode;
            switch (code) {
                case 81: // Q
                    if(camera.upY === 0) camera.upY = 200;
                    break;
                case 90: // Z
                    useNextBlock(useBlock);
                    break;
                case 88: // X
                    usePrevBlock(useBlock);
                    break;
                case 67: // C
                    useNextBlockData(useBlock);
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
                case 84:
                    //var cameraPos = camera.getPos();
                    //var cameraRot = camera.getRot();
                  break;
                case 80: // P
                    /*var xxx = Math.floor(camera.pos[0]/16);
                    var zzz = Math.floor(camera.pos[2]/16);
                    mcWorld.saveChunkToStorage(xxx, zzz);*/
                    //textDiv.innerHTML = "Zapisywanie ...";
                    mcWorld.save();
                    break;    
                case 71: // G
                    if(window["ace"] === undefined) break;
                    if(codeEditor === null){
                        codeEditor = ace.edit("editor");
                        codeEditor.setTheme("ace/theme/tomorrow_night");
                        codeEditor.getSession().setMode("ace/mode/javascript");
                        codeEditor.setValue("var pos = camera.getXYZPos();\n\
var block = { id: 17, data: 0};\n\
\n\
for(var i = -2; i < 3; i++)\n\
    for(var j = -2; j < 3; j++){\n\
    if(i > -2 && i < 2 && j > -2 && j < 2) continue;\n\
    useNextBlockData(block);\n\
    mcWorld.setBlock(pos.x+i,pos.y,pos.z+j,block.id,block.data);\n\
}\n\
\n\
mcWorld.updateChunks();");
                    }                                                                
                    var tools = document.getElementById("tools");
                    if(tools.style.display === "none") tools.style.display = "block";
                    else if(tools.style.display === "block") tools.style.display = "none";
                    document.exitPointerLock = document.exitPointerLock ||
                                               document.mozExitPointerLock ||
                                               document.webkitExitPointerLock;
                    document.exitPointerLock();
                    break;
                    /*var pos = camera.getXYZPos();
                    var id = 17;
                    var data = 0;
                    for(var i = -2; i < 3; i++)
                        for(var j = -2; j < 3; j++){
                            if(i > -2 && i < 2 && j > -2 && j < 2) continue;
                            data = getNextBlockDataId(id, data);
                            mcWorld.setBlock(pos.x+i,pos.y,pos.z+j,id,data);
                        }
                    mcWorld.updateChunks();*/
                    //console.log(window.localStorage);
                    /*var xxx = Math.floor(camera.pos[0]/16);
                    var zzz = Math.floor(camera.pos[2]/16);
                    mcWorld.loadChunkFromStorage(xxx, zzz, false);*/
                    break;    
                case 72: //H
                    if(window["ace"] === undefined) break;
                    executeJS();
                    break;
                case 77: // M
                    window.localStorage.clear();
                    //var timeNow3 = new Date().getTime();
                    //console.log("Run time "+Math.floor((timeNow3-firstTime)/1000));
                    break;    
                case 86: // V
                    console.log(camera.name);
                    //if(camera.name === "CameraGod") camera = new Camera(camera.getEye(),camera.rot,[0,1,0], true);
                    if(camera.name === "CameraGod") {
                        player.setPosRot(camera.getEye(), camera.getRot());
                        camera = new CameraPlayer(player);
                    }
                    else if(camera.name === "CameraPlayer") camera = new CameraGod(camera.getEye(),camera.getRot(),[0,1,0]);
                    camera.sensitivity = settings.sensitivity*2;
                    break;    
                default: 
                    //camera.moveBackward();
            }
        }
    }

    function keyUp(e){
        if(lastTarget === glCanvas){
            camera.keyUp(e);
            var code = e.keyCode;
            switch (code) {
                default: 
            }
        }
    }
    
    function mouseDown(e){
        lastTarget = e.target;
        
        if(lastTarget === glCanvas){
            camera.starex = e.clientX;
            camera.starey = e.clientY;

            if(settings.edit){
                if(camera.autoMove) selectE = true;
                if(e.button === 0) selectT = 0;
                else selectT = selectTt;
            }

            camera.mouseDown(fps);  
        }
    }

    function mouseUp(e){
        if(lastTarget === glCanvas){
            camera.mouseUp(fps);  
        }
    }

    function mouseMove(e){
        if(lastTarget === glCanvas){
            var x = e.clientX;
            var y = e.clientY;
            camera.mouseMove((camera.starex-x), (camera.starey-y), fps); 
            camera.starex = x;
            camera.starey = y;
        }
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
        if(lastTarget === glCanvas){
            // cross-browser wheel delta
            e = window.event || e; // old IE support
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            if(delta < 0) useNextBlock(useBlock);
            else usePrevBlock(useBlock);
        }
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
        glCanvas = document.getElementById("webgl");
        glCanvas.width = window.innerWidth;
        glCanvas.height = window.innerHeight;
        window.onresize = windowResize;
        window.addEventListener( "keydown", keyDown, false);
        window.addEventListener( "keyup", keyUp, true);
        glCanvas.onclick = canvasOn;

        document.addEventListener('pointerlockchange', pointerChange, false);
        document.addEventListener('mozpointerlockchange', pointerChange, false);
        document.addEventListener('webkitpointerlockchange', pointerChange, false);
        //window.addEventListener( "mousemove", mouseMove, true);
        window.addEventListener("mousedown", mouseDown, true);
        window.addEventListener("mouseup", mouseUp, true);
        window.addEventListener("mousewheel", mouseWheel, false);
	window.addEventListener("DOMMouseScroll", mouseWheel, false);
        
        textDiv = document.getElementById("text");
        
        gluu.initGL(glCanvas);
        gluu.initStandardShader();
        gluu.initLineShader();
        gluu.initSelectionShader();
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.cullFace(gl.BACK);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);
        
        initTextures();
        initBlocks();
        
        player = new Player();
        if(settings.cameraType === "CameraGod")
            camera = new CameraGod(settings.pos,settings.rot,[0,1,0]);
        else if(settings.cameraType === "Camera")
            camera = new Camera(settings.pos,settings.rot,[0,1,0]);
        else {
            player.setPosRot([settings.pos[0],settings.pos[1],settings.pos[2]], [settings.rot[0],settings.rot[1]]);
            camera = new CameraPlayer(player);
        }
        camera.sensitivity = settings.sensitivity * 2;
        
        for(var i = 0; i < 4; i++){
            punkty1[i] = new Object();
            punkty1[i].d = new Float32Array(2000000);
            punkty1[i].o = 0;
        }

        mcWorld = new RegionLib(settings.gameRoot, settings.worldName);
        
        document.getElementById("tools").style.display = 'none';
        
        firstTime = new Date().getTime();
        lastTime = new Date().getTime();
        tick();       
    }
    
    function executeJS(){
        eval(codeEditor.getValue());
    }
    
