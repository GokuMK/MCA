function Settings(){
    var parameters = new Object();

    window.location.search.substr(1).split("&").forEach(function(item) {parameters[item.split("=")[0]] = item.split("=")[1];});
    window.location.hash.substr(1).split("&").forEach(function(item) {parameters[item.split("=")[0]] = item.split("=")[1];});
    
    var settings = JSON.parse(Readfile.readTxt('settings.json'));
    console.log(settings);
    //this["yyyy"] = "aaa";
    //console.log(this);
    
    this.gameRoot = settings["gameroot"].value;
    if( parameters["gameroot"] !== undefined && settings["gameroot"].url) 
        this.gameRoot = parameters["gameroot"];
    
    this.worldName = settings["worldname"].value;
    if( parameters["worldname"] !== undefined && settings["worldname"].url) 
        this.worldName = parameters["worldname"];
    
    this.distanceLevel = [10,10,10];
    if( settings["distanceLevel"] !== undefined ){
        this.distanceLevel[0] = parseInt((settings["distanceLevel"].value.split("-"))[0]) || this.distanceLevel[0]; 
        this.distanceLevel[1] = parseInt((settings["distanceLevel"].value.split("-"))[1]) || this.distanceLevel[1]; 
        this.distanceLevel[2] = parseInt((settings["distanceLevel"].value.split("-"))[2]) || this.distanceLevel[2]; 
    }        
    if( parameters["distanceLevel"] !== undefined && settings["distanceLevel"].url){
        this.distanceLevel[0] = parseInt((parameters["distanceLevel"].split("-"))[0]) || this.distanceLevel[0]; 
        this.distanceLevel[1] = parseInt((parameters["distanceLevel"].split("-"))[1]) || this.distanceLevel[1]; 
        this.distanceLevel[2] = parseInt((parameters["distanceLevel"].split("-"))[2]) || this.distanceLevel[2]; 
    }        
    
    if(this.distanceLevel[0] < 10) this.distanceLevel[0] = 10;
    if(this.distanceLevel[1] < this.distanceLevel[0]) this.distanceLevel[1] = this.distanceLevel[0];
    if(this.distanceLevel[2] < this.distanceLevel[0]) this.distanceLevel[2] = this.distanceLevel[0];
    if(this.distanceLevel[0] > 100) this.distanceLevel[0] = 100;
    if(this.distanceLevel[1] > 100) this.distanceLevel[1] = 100;
    if(this.distanceLevel[2] > 100) this.distanceLevel[2] = 100;

    
    this.sensitivity = 50;
    if( settings["mouseSensitivity"] !== undefined )
        this.sensitivity = parseInt(settings["mouseSensitivity"].value);
    if( parameters["mouseSensitivity"] !== undefined && settings["mouseSensitivity"].url)
        this.sensitivity = parseInt(parameters["mouseSensitivity"]);

    if(this.sensitivity < 10) this.sensitivity = 10;
    if(this.sensitivity > 100) this.sensitivity = 100;
    
    
    this.pos = [0,100,0];
    this.rot = [0,0];
    if( settings["pos"] !== undefined ){
        this.pos[0] = parseFloat((settings["pos"].value.split("+"))[0]) || this.pos[0]; 
        this.pos[1] = parseFloat((settings["pos"].value.split("+"))[1]) || this.pos[1]; 
        this.pos[2] = parseFloat((settings["pos"].value.split("+"))[2]) || this.pos[2]; 
    }
    if( parameters["pos"] !== undefined && settings["pos"].url){
        this.pos[0] = parseFloat((parameters["pos"].split("+"))[0]) || this.pos[0]; 
        this.pos[1] = parseFloat((parameters["pos"].split("+"))[1]) || this.pos[1]; 
        this.pos[2] = parseFloat((parameters["pos"].split("+"))[2]) || this.pos[2]; 
    }
    if( settings["rot"] !== undefined ){
        this.rot[0] = parseFloat((settings["rot"].value.split("+"))[0]) || this.rot[0]; 
        this.rot[1] = parseFloat((settings["rot"].value.split("+"))[1]) || this.rot[1]; 
    }
    if( parameters["rot"] !== undefined && settings["rot"].url){
        this.rot[0] = parseFloat((parameters["rot"].split("+"))[0]) || this.rot[0]; 
        this.rot[1] = parseFloat((parameters["rot"].split("+"))[1]) || this.rot[1]; 
    }
    
    this.skyColor = new Float32Array([1,1,1,1]);
    if( settings["skyColor"] !== undefined ){
        this.skyColor[0] = parseFloat((settings["skyColor"].value.split("-"))[0])/255 || this.skyColor[0]; 
        this.skyColor[1] = parseFloat((settings["skyColor"].value.split("-"))[1])/255 || this.skyColor[1]; 
        this.skyColor[2] = parseFloat((settings["skyColor"].value.split("-"))[2])/255 || this.skyColor[2]; 
    }
    if( parameters["skyColor"] !== undefined && settings["skyColor"].url){
        this.skyColor[0] = parseFloat((parameters["skyColor"].split("-"))[0])/255 || this.skyColor[0]; 
        this.skyColor[1] = parseFloat((parameters["skyColor"].split("-"))[1])/255 || this.skyColor[1]; 
        this.skyColor[2] = parseFloat((parameters["skyColor"].split("-"))[2])/255 || this.skyColor[2]; 
    }
    this.sun = 1.0;
    if( settings["sun"] !== undefined )
        this.sun = (parseFloat(settings["sun"].value) + 0.1) || this.sun; 
    if( parameters["sun"] !== undefined && settings["sun"].url)
        this.sun = (parseFloat(parameters["sun"]) + 0.1) || this.sun; 

    this.brightness = 0.3;
    if( settings["brightness"] !== undefined )
        this.brightness = (parseFloat(settings["brightness"].value) + 0.1) || this.brightness; 
    if( parameters["brightness"] !== undefined && settings["brightness"].url)
        this.brightness = (parseFloat(parameters["brightness"]) + 0.1) || this.brightness; 

    this.worldShader = "standard";
    if( settings["worldShader"] !== undefined )
        this.worldShader = settings["worldShader"].value || this.worldShader; 
    if( parameters["worldShader"] !== undefined && settings["worldShader"].url)
        this.worldShader = parameters["worldShader"] || this.worldShader; 

    this.edit = true;
    if( settings["edit"] !== undefined )
        this.edit = settings["edit"].value; 
    //camera = new Camera([-400,120,0],[5.5,0],[0,1,0]);
    //camera = new CameraGod([0,120,0],[5.5,0],[0,1,0]);
    //camera = new Camera([-176,90,2],[5.5,0],[0,1,0]);
    //camera = new CameraGod([-176,90,2],[5.5,0],[0,1,0]);
    this.cameraType = settings["camera"].value;
    if( parameters["camera"] !== undefined && settings["camera"].url)
        this.cameraType = parameters["camera"];
}