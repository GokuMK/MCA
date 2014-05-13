function Player(p, r, u){
    this.pos = p || [0,0,0];
    this.rot = r || [0,0];
    this.up = u || [0,1,0];
    this.eyePos = [0,1.65,0];
    this.przesx = 8;
    this.przesy = 1; 
    this.przesz = 8;
    this.drawName = true;
    this.name = "";
    this.texture = playerTexture;
}
Player.prototype = Mob.prototype;

Player.prototype.shape = new Float32Array([
                -0.3,0.01,-0.3, 0.0, 0.0,
                -0.3,0.01, 0.3, 0.0, 0.0,
                -0.3, 1.8, 0.3, 0.0, 0.0,
                0.3, 1.8,-0.3, 0.0, 0.0,
                -0.3,0.01,-0.3, 0.0, 0.0,
                
                -0.3, 1.8,-0.3, 0.0, 0.0,
                0.3,0.01, 0.3, 0.0, 0.0,
                -0.3,0.01,-0.3, 0.0, 0.0,
                0.3,0.01,-0.3, 0.0, 0.0,
                0.3, 1.8,-0.3, 0.0, 0.0,
                0.3,0.01,-0.3, 0.0, 0.0,
                
                -0.3,0.01,-0.3, 0.0, 0.0,
                -0.3,0.01,-0.3, 0.0, 0.0,
                -0.3, 1.8, 0.3, 0.0, 0.0,
                -0.3, 1.8,-0.3, 0.0, 0.0,
                0.3,0.01, 0.3, 0.0, 0.0,
                -0.3,0.01, 0.3, 0.0, 0.0,
                
                -0.3,0.01,-0.3, 0.0, 0.0,
                -0.3, 1.8, 0.3, 0.0, 0.0,
                -0.3,0.01, 0.3, 0.0, 0.0,
                0.3,0.01, 0.3, 0.0, 0.0,
                0.3, 1.8, 0.3, 0.0, 0.0,
                0.3,0.01,-0.3, 0.0, 0.0,
                
                0.3, 1.8,-0.3, 0.0, 0.0,
                0.3,0.01,-0.3, 0.0, 0.0,
                0.3, 1.8, 0.3, 0.0, 0.0,
                0.3,0.01, 0.3, 0.0, 0.0,
                0.3, 1.8, 0.3, 0.0, 0.0,
                0.3, 1.8,-0.3, 0.0, 0.0,
                -0.3, 1.8,-0.3, 0.0, 0.0,
                
                0.3, 1.8, 0.3, 0.0, 0.0,
                -0.3, 1.8,-0.3, 0.0, 0.0,
                -0.3, 1.8, 0.3, 0.0, 0.0,
                0.3, 1.8, 0.3, 0.0, 0.0,
                -0.3, 1.8, 0.3, 0.0, 0.0,
                0.3,0.01, 0.3, 0.0, 0.0
                ]);
                
Player.prototype.nameShape = new Float32Array([
                -1.2,1.9,0.0, 1.0, 1.0, 1500.0, 0.0, 1.0 , 0.0,
                -1.2,2.2,0.0, 1.0, 0.0, 1500.0, 0.0, 1.0 , 0.0,
                1.2,2.2,0.0, 0.0, 0.0, 1500.0, 0.0, 1.0 , 0.0,
                 1.2,2.2,0.0, 0.0, 0.0, 1500.0, 0.0, 1.0 , 0.0,
                1.2,1.9,0.0, 0.0, 1.0, 1500.0, 0.0, 1.0 , 0.0,
                -1.2,1.9,0.0, 1.0, 1.0, 1500.0, 0.0, 1.0 , 0.0,
    
                -1.2,2.2,0.0, 1.0, 0.0, 1500.0, 0.0, 1.0 , 0.0,
                -1.2,1.9,0.0, 1.0, 1.0, 1500.0, 0.0, 1.0 , 0.0,
                1.2,2.2,0.0, 0.0, 0.0, 1500.0, 0.0, 1.0 , 0.0,
                1.2,1.9,0.0, 0.0, 1.0, 1500.0, 0.0, 1.0 , 0.0,
                1.2,2.2,0.0, 0.0, 0.0, 1500.0, 0.0, 1.0 , 0.0,
                -1.2,1.9,0.0, 1.0, 1.0, 1500.0, 0.0, 1.0 , 0.0
                
                ]);