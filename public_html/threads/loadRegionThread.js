self.addEventListener('message', function(e) {
        var x = e.data.x;
        var y = e.data.y;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', e.data.name, false);
        xhr.responseType = 'arraybuffer';
        try{
            xhr.send();
        } catch(e) {
            self.postMessage({loaded: 0, x: x, y: y});
            self.close();
            return;
        }
        var regionData =  new Uint8Array(xhr.response);
        self.postMessage({loaded: 1, x: x, y: y, data: regionData.buffer}, [regionData.buffer]);
        self.close();
    }, false);