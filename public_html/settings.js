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
    
    this.server = undefined;
    if( settings["server"] !== undefined )
        this.server = settings["server"].value;
    if( parameters["server"] !== undefined) 
        this.server = parameters["server"];
    
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
        this.sun = (parseFloat(settings["sun"].value) + 0.01) || this.sun; 
    if( parameters["sun"] !== undefined && settings["sun"].url)
        this.sun = (parseFloat(parameters["sun"]) + 0.01) || this.sun; 
    if(this.sun > 1.0) this.sun = 1.0;

    this.brightness = 0.3;
    if( settings["brightness"] !== undefined )
        this.brightness = (parseFloat(settings["brightness"].value) + 0.01) || this.brightness; 
    if( parameters["brightness"] !== undefined && settings["brightness"].url)
        this.brightness = (parseFloat(parameters["brightness"]) + 0.01) || this.brightness; 

    this.loadLag = 3;
    if( settings["loadLag"] !== undefined )
        this.loadLag = (parseFloat(settings["loadLag"].value)) || this.loadLag; 
    if( parameters["loadLag"] !== undefined && settings["loadLag"].url)
        this.loadLag = (parseFloat(parameters["loadLag"])) || this.loadLag; 
    
    this.loadSpeed = 1;
    if( settings["loadSpeed"] !== undefined )
        this.loadSpeed = (parseFloat(settings["loadSpeed"].value)) || this.loadSpeed; 
    if( parameters["loadSpeed"] !== undefined && settings["loadSpeed"].url)
        this.loadSpeed = (parseFloat(parameters["loadSpeed"])) || this.loadSpeed; 
    
    this.worldShader = "standard";
    if( settings["worldShader"] !== undefined )
        this.worldShader = settings["worldShader"].value || this.worldShader; 
    if( parameters["worldShader"] !== undefined && settings["worldShader"].url)
        this.worldShader = parameters["worldShader"] || this.worldShader; 

    this.edit = true;
    if( settings["edit"] !== undefined )
        this.edit = settings["edit"].value; 
    if( settings["edit"] !== undefined && settings["edit"].url){
        if(parameters["edit"] === "true") this.edit = true; 
        if(parameters["edit"] === "false") this.edit = false; 
    }
    
    this.lightInit = false;
    if( settings["lightInit"] !== undefined )
        this.lightInit = settings["lightInit"].value; 
    if( settings["lightInit"] !== undefined && settings["lightInit"].url){
        if(parameters["lightInit"] === "true") this.lightInit = true; 
        if(parameters["lightInit"] === "false") this.lightInit = false; 
    }
    //camera = new Camera([-400,120,0],[5.5,0],[0,1,0]);
    //camera = new CameraGod([0,120,0],[5.5,0],[0,1,0]);
    //camera = new Camera([-176,90,2],[5.5,0],[0,1,0]);
    //camera = new CameraGod([-176,90,2],[5.5,0],[0,1,0]);
    this.cameraType = settings["camera"].value;
    if( parameters["camera"] !== undefined && settings["camera"].url)
        this.cameraType = parameters["camera"];
}

Settings.prototype.setDistanceLevel = function(val){
        this.distanceLevel = [val,val,val];
        document.getElementById("setDstLvl_val").innerHTML = this.distanceLevel[0];
        this.getSettingsURL();
    };
    
Settings.prototype.setSkyColor = function(color){
        this.skyColor[0] = color[0];
        this.skyColor[1] = color[1];
        this.skyColor[2] = color[2];
        this.getSettingsURL();
    };
    
Settings.prototype.setSun = function(value){
        this.sun = value;
        //console.log(settings.skyColor);
        document.getElementById("setSun_val").innerHTML = this.sun;
        this.getSettingsURL();
    };
    
Settings.prototype.setBrightness = function(value){
        this.brightness = value;
        //console.log(settings.skyColor);
        document.getElementById("setBrightness_val").innerHTML = this.brightness;
        this.getSettingsURL();
    };
    
Settings.prototype.getSettingsURL = function(){
       //console.log(document.location);
       var url2 = document.location.href.split(/#/)[0];
       url2 = url2.split(/\?/);
       var url3;
       if(url2[1] === undefined) url3 = [];
       else url3 = url2[1].split(/&/);
       
       var url = url2[0]+"?";
       var names = { };
       var s = this;
       url3.forEach(function(e) {
           url+="&";
           if(e.split(/=/)[0].toLowerCase() === "sun") {
               names["sun"] = true;
               url+="sun="+s.sun;
           } else if(e.split(/=/)[0].toLowerCase() === "skycolor") {
               names["skyColor"] = true;
               url+="skyColor="+Math.floor(s.skyColor[0]*255)+"-"+Math.floor(s.skyColor[1]*255)+"-"+Math.floor(s.skyColor[2]*255);
           } else if(e.split(/=/)[0].toLowerCase() === "brightness") {
               names["brightness"] = true;
               url+="brightness="+s.brightness;
           } else if(e.split(/=/)[0].toLowerCase() === "worldshader") {
               names["worldshader"] = true;
               url+="worldShader="+s.worldShader;
           } else if(e.split(/=/)[0].toLowerCase() === "distancelevel") {
               names["distancelevel"] = true;
               url+="distanceLevel="+s.distanceLevel[0];
           } else {
               url+=e;
           }
       });
       if(names["sun"] !== true) url+="&sun="+this.sun;
       if(names["worldshader"] !== true) url+="&worldShader="+this.worldShader;
       if(names["brightness"] !== true) url+="&brightness="+this.brightness;
       if(names["distancelevel"] !== true) url+="&distanceLevel="+this.distanceLevel[0];
       if(names["skyColor"] !== true) url+="&skyColor="+Math.floor(this.skyColor[0]*255)+"-"+Math.floor(this.skyColor[1]*255)+"-"+Math.floor(this.skyColor[2]*255);

       document.getElementById("settingsURL").value = url+window.location.hash;
    };
    
Settings.prototype.setHashURL = function(cameraPos, cameraRot, name){
        window.location.hash =
            "pos="+cameraPos[0].toFixed(2)+"+"+cameraPos[1].toFixed(2)+"+"+cameraPos[2].toFixed(2)
            +"&rot="+cameraRot[0].toFixed(2)+"+"+cameraRot[1].toFixed(2)
            +"&camera="+name;
    };