function Player(p, r, u){
    this.pos = p || [0,0,0];
    this.rot = r || [0,0];
    this.up = u || [0,1,0];
    this.eyePos = [0,1.65,0];
    this.przesx = 8;
    this.przesy = 1; 
    this.przesz = 8;
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
                