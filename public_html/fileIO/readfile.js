Readfile = new Object();

Readfile.readKuju = function(path, obj, t){
        var type = false;
        if(t === undefined) type = true;
        //console.log(path);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path.toLowerCase(), type);
        xhr.responseType = 'arraybuffer';
        if(type) xhr.onload = function(e) {
          var scriptsrc = new Uint8Array(xhr.response);
          //var scriptsrc2 = new Uint32Array(xhr.response);
          //var mdata = new DataView(xhr.response);
          //initBuffers(scriptsrc, mdata);
          var dane;

          if(scriptsrc[7] === 70){ //F
            //console.log(scriptsrc[7]);
            var inflate = new Zlib.Inflate(scriptsrc,{'index': 16});
            var plain = inflate.decompress();
            //console.log(plain.length);
            dane = plain;
          } else {
            dane = scriptsrc.subarray(16, scriptsrc.length-16);
          }

          obj.load(dane);
        };
        try{
            xhr.send();
        } catch(e) {
            return -1;
        }
        if(type) return;
          var scriptsrc = new Uint8Array(xhr.response);
          var dane;
          if(scriptsrc[7] === 70){ //F
            var inflate = new Zlib.Inflate(scriptsrc,{'index': 16});
            var plain = inflate.decompress();
            dane = plain;
          } else {
            //console.log(scriptsrc[16]);
            dane = new Uint8Array(scriptsrc.buffer.slice(16));
            //console.log(dane[16]);
          }
        return dane;
};

Readfile.readRAW = function(path, obj, t){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path, false);
        xhr.responseType = 'arraybuffer';

        try{
            xhr.send();
        } catch(e) {
            return -1;
        }
        
        return new Uint8Array(xhr.response);
};

Readfile.readTxt = function(path, obj, t){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path, false);
        xhr.responseType = 'application/json';

        xhr.send();
        return xhr.response;
};