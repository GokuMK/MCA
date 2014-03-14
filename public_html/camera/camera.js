function Camera(e,r,u){
     this.name = "Camera";
     this.pos = e;
     this.oldPos = new Float32Array(3);
     this.tPos = new Float32Array(3);
     this.tPos[0] = this.pos[0];
     this.tPos[1] = this.pos[1];
     this.tPos[2] = this.pos[2];
     this.eyePos = [0,1.65,0];
     //this.relPos = e;
     this.rot = r;
     this.up = u;
     this.przesx = 8;
     this.przesy = 1; 
     this.przesz = 8;
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

Camera.prototype.getMatrix = function(){
    var lookAt = mat4.create();
    mat4.lookAt(lookAt, this.getEye(), this.getTarget(), this.up);
    return lookAt;
};

Camera.prototype.getRot = function(){
    return [this.rot[0], this.rot[1], this.rot[2]];
};

Camera.prototype.getEye = function(){
    return [this.pos[0] + this.eyePos[0], this.pos[1] + this.eyePos[1], this.pos[2] + this.eyePos[2]];
};

Camera.prototype.getPos = function(){
    return [this.pos[0], this.pos[1], this.pos[2]];
};

Camera.prototype.getTarget = function(){
    return [this.pos[0] + this.eyePos[0] + Math.sin(this.rot[0]) * Math.cos(this.rot[1]), 
        this.pos[1] + this.eyePos[1] + Math.sin(this.rot[1]) * 1, 
        this.pos[2] + this.eyePos[2] + Math.cos(this.rot[0]) * Math.cos(this.rot[1]) ];
};

Camera.prototype.moveForward = function(fps){
        this.tPos[2] = this.pos[2] + (this.przesz/fps) * Math.cos(this.rot[0]);//* Math.cos(this.rot[1]);
        this.tPos[0] = this.pos[0] + (this.przesz/fps) * Math.sin(this.rot[0]);//* Math.cos(this.rot[1]);
        this.tPos[1] = this.pos[1];// + (this.przesz/fps) * Math.sin(this.rot[1]);
    };

Camera.prototype.moveBackward = function(fps){
        this.tPos[2] = this.pos[2] - (this.przesz/fps) * Math.cos(this.rot[0]);//* Math.cos(this.rot[1]);
        this.tPos[0] = this.pos[0] - (this.przesz/fps) * Math.sin(this.rot[0]);//* Math.cos(this.rot[1]);
        this.tPos[1] = this.pos[1];// - (this.przesz/fps) * Math.sin(this.rot[1]);
    };

Camera.prototype.moveLeft = function(fps){
        this.tPos[0] = this.pos[0] + (this.przesz/fps) * Math.cos(this.rot[0]);
        this.tPos[1] = this.pos[1];
        this.tPos[2] = this.pos[2] - (this.przesz/fps) * Math.sin(this.rot[0]);
    };

Camera.prototype.moveRight = function(fps){
        this.tPos[0] = this.pos[0] - (this.przesz/fps) * Math.cos(this.rot[0]);
        this.tPos[1] = this.pos[1];
        this.tPos[2] = this.pos[2] + (this.przesz/fps) * Math.sin(this.rot[0]);
    };

Camera.prototype.mouseDown = function(fps){
        this.lpm = 1;
    };

Camera.prototype.mouseUp = function(fps){
        this.lpm = 0;
    };

Camera.prototype.mouseMove = function(x, y, fps){
        if(this.lpm === 1 || this.autoMove){ 
            if(fps < 20) fps = 20;
            //if(y === 0 && x === 0) return;
            this.patrzX((x)/(fps*3));
            this.patrzY((y)/(fps*3));
        }
    };
    
Camera.prototype.patrzX = function(f){
        this.rot[0] += f;
    };

Camera.prototype.patrzY = function(f){
        this.rot[1] += f;
        if (this.rot[1] > 1.57) {
            this.rot[1] = 1.57;
        }
        if (this.rot[1] < -1.57) {
            this.rot[1] = -1.57;
        }
    };
    
Camera.prototype.updatePosition = function(fps) {
        this.oldPos[0] = this.pos[0];
        this.oldPos[1] = this.pos[1];
        this.oldPos[2] = this.pos[2];
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
        
        this.pos[1] = this.tPos[1];
        if(testCollisions()){
            //var pos1 = false;
            this.pos[1] = this.oldPos[1];
        } else {
            //var pos1 = true;
            this.oldPos[1] = this.pos[1];
        }
        //this.pos[1] = this.oldPos[1];

        this.pos[2] = this.tPos[2];
        if(testCollisions()){
            //var pos2 = false;
            this.pos[2] = this.oldPos[2];
        } else {
            //var pos2 = true;
            this.oldPos[2] = this.pos[2];
        }
        //this.pos[2] = this.oldPos[2];
        
        this.pos[0] = this.tPos[0];
        if(testCollisions()){
            //var pos0 = false;
            this.pos[0] = this.oldPos[0];
        } else {
            //var pos0 = true;
            this.oldPos[0] = this.pos[0];
        }
        
        this.patrzX((this.moveX)/(this.sensitivity));
        this.patrzY((this.moveY)/(this.sensitivity));
        this.moveX = 0;
        this.moveY = 0;
        
        //this.pos[0] = this.oldPos[0];
        this.tPos[0] = this.pos[0];
        this.tPos[1] = this.pos[1];
        this.tPos[2] = this.pos[2];
        //if(!pos1) 
      //  this.pos[1] = this.tPos[1];
       // if(!pos2) 
      //  this.pos[2] = this.tPos[2];
      //  if(!pos0) 
      //  this.pos[0] = this.tPos[0];
    };
    
Camera.prototype.previousPosition = function(){
        this.pos[0] = this.oldPos[0];
        this.pos[1] = this.oldPos[1];
        this.pos[2] = this.oldPos[2];
    };
    
Camera.prototype.moveUp = function(fps) {
        this.tPos[1] += this.przesy;
    };

Camera.prototype.moveDown = function(fps) {
        this.tPos[1] -= this.przesy;
    };
    
Camera.prototype.keyUp = function(e){
        var code = e.keyCode;
        this.move = false;
        switch (code) {
            case 81:
                //this.jestcontrol = 0;
                break;
            case 69: // E
                this.przesx = this.przesz = 10;
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
Camera.prototype.keyDown = function(e, fps){  
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
                this.przesx = this.przesz = 20;
                break;
            default: 
                //camera.moveBackward();
        }
    };