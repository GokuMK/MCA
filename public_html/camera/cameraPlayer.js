function CameraPlayer(p){
     this.name = "CameraPlayer";
     this.entity = p;
     this.failing = 0;
     this.oldPos = new Float32Array(3);
     this.tPos = new Float32Array(3);
     this.nPos1 = new Float32Array(3);
     this.nPos2 = new Float32Array(3);
     this.tPos[0] = p.pos[0];
     this.tPos[1] = p.pos[1];
     this.tPos[2] = p.pos[2];
     this.lpm = 0;
     this.control = 0;
     this.fovy = 3.14/3;
     this.aspect = gl.viewportWidth / gl.viewportHeight;
     this.fovx = this.fovy * this.aspect;
     this.starex = 0;
     this.starey = 0;
     this.autoMove = true;
     this.lastTime = 0;
     this.sensitivity = 100; 
     this.moveF = false;
     this.moveB = false;
     this.moveL = false;
     this.moveR = false;
     
     this.moveX = 0;
     this.moveY = 0;
     
     this.upY = 0;
}

CameraPlayer.prototype.getMatrix = function(){
    var lookAt = mat4.create();
    mat4.lookAt(lookAt, this.getEye(), this.getTarget(), this.entity.up);
    return lookAt;
};

CameraPlayer.prototype.getRot = function(){
    return [this.entity.rot[0], this.entity.rot[1], this.entity.rot[2]];
};

CameraPlayer.prototype.getEye = function(){
    return this.entity.getEye();
};

CameraPlayer.prototype.getPos = function(){
    return [this.entity.pos[0], this.entity.pos[1], this.entity.pos[2]];
};

CameraPlayer.prototype.getXYZPos = function(){
    return { x: Math.floor(this.entity.pos[0]), y: Math.floor(this.entity.pos[1]), z: Math.floor(this.entity.pos[2]) };
};

CameraPlayer.prototype.getTarget = function(){
    return this.entity.getTarget();
};

CameraPlayer.prototype.moveForward = function(fps){
        this.tPos[2] = this.entity.pos[2] + (this.entity.przesz/fps) * Math.cos(this.entity.rot[0]);
        this.tPos[0] = this.entity.pos[0] + (this.entity.przesz/fps) * Math.sin(this.entity.rot[0]);
        this.tPos[1] = this.entity.pos[1];
    };

CameraPlayer.prototype.moveBackward = function(fps){
        this.tPos[2] = this.entity.pos[2] - (this.entity.przesz/fps) * Math.cos(this.entity.rot[0]);
        this.tPos[0] = this.entity.pos[0] - (this.entity.przesz/fps) * Math.sin(this.entity.rot[0]);
        this.tPos[1] = this.entity.pos[1];
    };

CameraPlayer.prototype.moveLeft = function(fps){
        this.tPos[0] = this.entity.pos[0] + (this.entity.przesz/fps) * Math.cos(this.entity.rot[0]);
        this.tPos[1] = this.entity.pos[1];
        this.tPos[2] = this.entity.pos[2] - (this.entity.przesz/fps) * Math.sin(this.entity.rot[0]);
    };

CameraPlayer.prototype.moveRight = function(fps){
        this.tPos[0] = this.entity.pos[0] - (this.entity.przesz/fps) * Math.cos(this.entity.rot[0]);
        this.tPos[1] = this.entity.pos[1];
        this.tPos[2] = this.entity.pos[2] + (this.entity.przesz/fps) * Math.sin(this.entity.rot[0]);
    };

CameraPlayer.prototype.mouseDown = function(fps){
        this.lpm = 1;
    };

CameraPlayer.prototype.mouseUp = function(fps){
        this.lpm = 0;
    };

CameraPlayer.prototype.mouseMove = function(x, y, fps){
        if(this.lpm === 1 || this.autoMove){ 
            if(fps < 20) fps = 20;
            //if(y === 0 && x === 0) return;
            this.patrzX((x)/(fps*3));
            this.patrzY((y)/(fps*3));
        }
    };
    
CameraPlayer.prototype.patrzX = function(f){
        this.entity.rot[0] += f;
    };

CameraPlayer.prototype.patrzY = function(f){
        this.entity.rot[1] += f;
        if (this.entity.rot[1] > 1.57) {
            this.entity.rot[1] = 1.57;
        }
        if (this.entity.rot[1] < -1.57) {
            this.entity.rot[1] = -1.57;
        }
    };
    
CameraPlayer.prototype.updatePosition = function(fps) {
        this.oldPos[0] = this.entity.pos[0];
        this.oldPos[1] = this.entity.pos[1];
        this.oldPos[2] = this.entity.pos[2];

        if(fps < 20) fps = 20;
        if(this.moveF)
            if (this.jestcontrol === 1) {
            //    this.moveUp(fps);
            } else {
                this.moveForward(fps);
            }
        if(this.moveB){
            if (this.jestcontrol === 1) {
            //    this.moveDown(fps);
            } else {
                this.moveBackward(fps);
            }
        }
        if(this.moveR)
            this.moveRight(fps);
        if(this.moveL)
            this.moveLeft(fps);

       
        if(this.upY === 0){
            this.tPos[1] -= (10/fps);
        } else {
            this.tPos[1] += (8/fps);
            this.upY -= (1000/fps);
            if(this.upY < 0) this.upY = 0;
        }
        
        ////////////////////////
        var npos1 = 0;
        this.entity.pos[1] = this.tPos[1];
        if(mcWorld.testCollisions()){
            this.failing = 0;
            this.entity.pos[1] = this.oldPos[1];
        } else {
            this.failing = 1;
        }
        
        this.entity.pos[2] = this.tPos[2];
        if(mcWorld.testCollisions()){
            this.entity.pos[2] = this.oldPos[2];
            npos1++;
        }
        
        this.entity.pos[0] = this.tPos[0];
        if(mcWorld.testCollisions()){
            this.entity.pos[0] = this.oldPos[0];
            npos1++;
        }
        
        this.nPos1[0] = this.entity.pos[0];
        this.nPos1[1] = this.entity.pos[1];
        this.nPos1[2] = this.entity.pos[2];
        var npos11 = Math.abs(this.nPos1[0] - this.oldPos[0]) + Math.abs(this.nPos1[2] - this.oldPos[2]);
        
        ////////////////////////
        var npos2 = 0;
        this.entity.pos[0] = this.oldPos[0];
        this.entity.pos[1] = this.oldPos[1];
        this.entity.pos[2] = this.oldPos[2];
        if(this.failing === 0)
            this.tPos[1] = this.oldPos[1] + 0.50;
        else
            this.tPos[1] = this.oldPos[1] + 0.00;
        this.entity.pos[1] = this.tPos[1];
        if(mcWorld.testCollisions())
            this.entity.pos[1] = this.oldPos[1];

        this.entity.pos[2] = this.tPos[2];
        if(mcWorld.testCollisions()){
            this.entity.pos[2] = this.oldPos[2];
            npos2++;
        }
        
        this.entity.pos[0] = this.tPos[0];
        if(mcWorld.testCollisions()){
            this.entity.pos[0] = this.oldPos[0];
            npos2++;
        } 
        
        var npos22 = Math.abs(this.entity.pos[0] - this.oldPos[0]) + Math.abs(this.entity.pos[2] - this.oldPos[2]);
        if(npos11 >= npos22){
            this.entity.pos[0] = this.nPos1[0];
            this.entity.pos[1] = this.nPos1[1];
            this.entity.pos[2] = this.nPos1[2];
        }
        //////////////////////////
        this.patrzX((this.moveX)/(this.sensitivity));
        this.patrzY((this.moveY)/(this.sensitivity));
        this.moveX = 0;
        this.moveY = 0;
        
        this.tPos[0] = this.entity.pos[0];
        this.tPos[1] = this.entity.pos[1];
        this.tPos[2] = this.entity.pos[2];
    };
    
CameraPlayer.prototype.moveUp = function(fps) {
        this.tPos[1] += this.przesy;
    };

CameraPlayer.prototype.moveDown = function(fps) {
        this.tPos[1] -= this.przesy;
    };
    
CameraPlayer.prototype.keyUp = function(e){
        var code = e.keyCode;
        this.move = false;
        switch (code) {
            case 81:
                //this.jestcontrol = 0;
                break;
            case 69: // E
                this.entity.przesx = this.entity.przesz = 10;
                break;
            case 37:  // left
            case 65: // A 
                this.moveL = false;
                //this.moveLeft(fps);
                break;
            case 38:    
            case 87: // W
                this.moveF = false;
                break;
            case 39: 
            case 68: // D 
                this.moveR = false;
                ///this.moveRight(fps);
                break;
            case 40: 
            case 83: // S 
                this.moveB = false;
                break;                
            default: 
                //camera.moveBackward();
        }
    };
CameraPlayer.prototype.keyDown = function(e, fps){  
        var code = e.keyCode;
        switch (code) {
            //case 17:
            //    jestcontrol = 1;
           //     break;
            case 81:
          //      this.jestcontrol = 1;
                break;
            case 37:  // left
            case 65: // A 
                this.moveL = true;
                break;
            case 38:    
            case 87: // W
                this.moveF = true;
                break;
            case 39: 
            case 68: // D 
                this.moveR = true;
                break;
            case 40: 
            case 83: // S 
                this.moveB = true;
                break;
            case 69: // E
                this.entity.przesx = this.entity.przesz = 20;
                break;
            default: 
                //camera.moveBackward();
        }
    };