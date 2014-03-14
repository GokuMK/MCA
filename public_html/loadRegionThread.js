self.addEventListener('message', function(e) {
        importScripts('fileIO/readfile.js');
        var regionData = Readfile.readRAW(e.data.name);
        var x = e.data.x;
        var y = e.data.y;
        //console.log(regionData);
        if(regionData === -1){
            self.postMessage({loaded: 0, x: x, y: y});
            self.close();
            return;
        } 
        self.postMessage({loaded: 1, x: x, y: y, data: regionData.buffer}, [regionData.buffer]);
        self.close();
    }, false);