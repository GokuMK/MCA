function CameraGod(e,r,u){
     this.name = "CameraGod";
     this.pos = e;
     this.oldPos = new Float32Array(3);
     //this.relPos = e;
     this.rot = r;
     this.up = u;
     this.przesx = 1;
     this.przesy = 1; 
     this.przesz = 1;
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
}

CameraGod.prototype.getMatrix = function(){
    var lookAt = mat4.create();
    mat4.lookAt(lookAt, this.getEye(), this.getTarget(), this.up);
    return lookAt;
};

CameraGod.prototype.getRot = function(){
    return [this.rot[0], this.rot[1], this.rot[2]];
};

CameraGod.prototype.getTarget = function(){
    return [this.pos[0] + Math.sin(this.rot[0]) * Math.cos(this.rot[1]), 
        this.pos[1] + Math.sin(this.rot[1]) * 1, 
        this.pos[2] + Math.cos(this.rot[0]) * Math.cos(this.rot[1]) ];
};

CameraGod.prototype.getEye = function(){
    return [this.pos[0], this.pos[1], this.pos[2]];
};

CameraGod.prototype.getPos = function(){
    return [this.pos[0], this.pos[1], this.pos[2]];
};

CameraGod.prototype.getXYZPos = function(){
    return { x: Math.floor(this.pos[0]), y: Math.floor(this.pos[1]), z: Math.floor(this.pos[2]) };
};

CameraGod.prototype.moveForward = function(fps){
        this.pos[2] = this.pos[2] + (30/fps) * this.przesz * Math.cos(this.rot[0])* Math.cos(this.rot[1]);
        this.pos[0] = this.pos[0] + (30/fps) * this.przesz * Math.sin(this.rot[0])* Math.cos(this.rot[1]);
        this.pos[1] = this.pos[1] + (30/fps) * this.przesz * Math.sin(this.rot[1]);
    };

CameraGod.prototype.moveBackward = function(fps){
        this.pos[2] = this.pos[2] - (30/fps) * this.przesz * Math.cos(this.rot[0])* Math.cos(this.rot[1]);
        this.pos[0] = this.pos[0] - (30/fps) * this.przesz * Math.sin(this.rot[0])* Math.cos(this.rot[1]);
        this.pos[1] = this.pos[1] - (30/fps) * this.przesz * Math.sin(this.rot[1]);
    };

CameraGod.prototype.moveLeft = function(fps){
        this.pos[0] = this.pos[0] + (30/fps) * this.przesz * Math.cos(this.rot[0]);
        this.pos[2] = this.pos[2] - (30/fps) * this.przesz * Math.sin(this.rot[0]);
    };

CameraGod.prototype.moveRight = function(fps){
        this.pos[0] = this.pos[0] - (30/fps) * this.przesz * Math.cos(this.rot[0]);
        this.pos[2] = this.pos[2] + (30/fps) * this.przesz * Math.sin(this.rot[0]);
    };

CameraGod.prototype.mouseDown = function(fps){
        this.lpm = 1;
    };

CameraGod.prototype.mouseUp = function(fps){
        this.lpm = 0;
    };

CameraGod.prototype.mouseMove = function(x, y, fps){
        if(this.lpm === 1 || this.autoMove){ 
            if(fps < 20) fps = 20;
            //if(y === 0 && x === 0) return;
            this.patrzX((x)/(fps*3));
            this.patrzY((y)/(fps*3));
        }
    };
    
CameraGod.prototype.patrzX = function(f){
        this.rot[0] += f;
    };

CameraGod.prototype.patrzY = function(f){
        this.rot[1] += f;
        if (this.rot[1] > 1.57) {
            this.rot[1] = 1.57;
        }
        if (this.rot[1] < -1.57) {
            this.rot[1] = -1.57;
        }
    };
    
CameraGod.prototype.updatePosition = function(fps) {
        //this.oldPos[0] = this.pos[0];
        //this.oldPos[1] = this.pos[1];
        //this.oldPos[2] = this.pos[2];
        
        if(this.moveF)
            if (this.jestcontrol === 1) {
                this.moveUp(fps);
            } else {
                this.moveForward(fps);
            }
        if(this.moveB){
            if (this.jestcontrol === 1) {
                this.moveDown(fps);
            } else {
                this.moveBackward(fps);
            }
        }
        if(this.moveR)
            this.moveRight(fps);
        if(this.moveL)
            this.moveLeft(fps);
        
        this.patrzX((this.moveX)/(this.sensitivity));
        this.patrzY((this.moveY)/(this.sensitivity));
        this.moveX = 0;
        this.moveY = 0;

    };
    
CameraGod.prototype.previousPosition = function(){
        this.pos[0] = this.oldPos[0];
        this.pos[1] = this.oldPos[1];
        this.pos[2] = this.oldPos[2];
    };
    
CameraGod.prototype.moveUp = function(fps) {
        this.pos[1] += this.przesy;
    };

CameraGod.prototype.moveDown = function(fps) {
        this.pos[1] -= this.przesy;
    };
    
CameraGod.prototype.keyUp = function(e){
        var code = e.keyCode;
        this.move = false;
        switch (code) {
            case 81:
                this.jestcontrol = 0;
                break;
            case 69: // E
                this.przesx = this.przesz = 1;
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
CameraGod.prototype.keyDown = function(e, fps){  
        var code = e.keyCode;
        switch (code) {
            //case 17:
            //    jestcontrol = 1;
           //     break;
            case 81:
                this.jestcontrol = 1;
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
                this.przesx = this.przesz = 5;
                break;
            default: 
                //camera.moveBackward();
        }
    };