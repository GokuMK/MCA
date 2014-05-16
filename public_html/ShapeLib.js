var ShapeLib = new Object();
ShapeLib.shapes = new Array();

ShapeLib.getObj = function(name){
    if(ShapeLib.shapes[name] !== undefined)
        return ShapeLib.shapes[name];
    
    var objFile = Readfile.readTxt(name).split('\n');
    //console.log(objFile);
    var v = new Array();
    var vn = new Array();
    var vt = new Array();
    var fv = new Array();
    var fvn = new Array();
    var fvt = new Array();
    
    var args;
    var f1, f2, f3;
    for(var i = 0; i < objFile.length; i++){
        args = objFile[i].replace("  "," ").split(' ');
        if(args[0].equalsIgnoreCase('v')){
            v.push(args[1]); v.push(args[2]); v.push(args[3]);
        }
        if(args[0].equalsIgnoreCase('vn')){
            vn.push(args[1]); vn.push(args[2]); vn.push(args[3]);
        }
        if(args[0].equalsIgnoreCase('vt')){
            vt.push(args[1]); vt.push(args[2]); vt.push(args[3]);
        }
        if(args[0].equalsIgnoreCase('f')){
            f1 = args[1].split('/');
            f2 = args[2].split('/');
            f3 = args[3].split('/');
            fv.push(f1[0]); fv.push(f2[0]); fv.push(f3[0]);
            fvt.push(f1[1]); fvt.push(f2[1]); fvt.push(f3[1]);
            fvn.push(f1[2]); fvn.push(f2[2]); fvn.push(f3[2]);
        }
    }
    console.log(v.length + " "+ vt.length)
    
    var shape = new Float32Array(fv.length * 9);
    var j = 0;
    for(var i = 0; i < fv.length; i++){
        shape[j++] = v[fv[i]*3+0 -3];
        shape[j++] = v[fv[i]*3+1 -3];
        shape[j++] = v[fv[i]*3+2 -3];
        shape[j++] = vt[fvt[i]*3+0 -3];
        shape[j++] = 1 - vt[fvt[i]*3+1 -3];
        shape[j++] = 1500.0;
        shape[j++] = 0.0;
        shape[j++] = 1.0;
        shape[j++] = 0.0;
    }
    
    ShapeLib.shapes[name] = shape;
    return shape;
};
