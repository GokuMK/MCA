String.prototype.equalsIgnoreCase = function(e){
    return this.toUpperCase() === e.toUpperCase();
};
function ab2str(ab) {
   var str = "";
   var abLen = ab.length;
   var CHUNK_SIZE = Math.pow(2, 10);
   var offset, len, subab;
   for (offset = 0; offset < abLen; offset += CHUNK_SIZE) {
      len = Math.min(CHUNK_SIZE, abLen-offset);
      subab = ab.subarray(offset, offset+len);
      str += String.fromCharCode.apply(null, subab);
   }
   return str;
}
function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function jenkins_hash(key) {
   var hash = 0;
   for (var i=0; i<key.length; ++i) {
      hash += key[i];
      hash += (hash << 10);
      hash ^= (hash >> 6);
   }
   hash += (hash << 3);
   hash ^= (hash >> 11);
   hash += (hash << 15);
   return (hash >>> 0);
}

function spiralLoop(n) {
    var r = Math.floor((Math.sqrt(n + 1) - 1) / 2) + 1;
    var p = (8 * r * (r - 1)) / 2;
    var en = r * 2;
    var a = (1 + n - p) % (r * 8);
    var pos = [0, 0, r];
        
    switch (Math.floor(a / (r * 2))) {
        case 0:
            pos[0] = a - r;
            pos[1] = -r;
            break;
        case 1:
            pos[0] = r;
            pos[1] = (a % en) - r;
            break;
        case 2:
            pos[0] = r - (a % en);
            pos[1] = r;
            break;
        case 3:
            pos[0] = -r;
            pos[1] = r - (a % en);
            break;
    }
    return pos;
}