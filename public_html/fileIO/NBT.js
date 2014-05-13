NBT = new Object();

NBT.nextTag = function(nbt){
        var tag = new Object();
        var nameLen = 0;
        //var name = "";
        var tagOffset = [0,1,2,4,8,4,8,0,0,0,0,0];
        
            tag.type = nbt.data[nbt.offset++];
            if(tag.type === undefined) return -1;
            switch(tag.type){
                case 0:
                    //console.log(tagType+" ");
                    tag.name = "";
                    break;
                case 1:
                    tag.name = NBT.getTagName(nbt, nameLen);
                    //console.log(tagType+" "+name);
                    tag.value = nbt.data[nbt.offset++];
                    //console.log("int: "+(int));
                    break;
                case 2:
                    tag.name = NBT.getTagName(nbt, nameLen);
                    //console.log(tagType+" "+name);
                    tag.value = (nbt.data[nbt.offset++]<<8) | nbt.data[nbt.offset++];
                    break;
                case 3:
                    tag.name = NBT.getTagName(nbt, nameLen);
                    //console.log(tagType+" "+name);
                    tag.value = (nbt.data[nbt.offset++]<<24) | (nbt.data[nbt.offset++]<<16) | (nbt.data[nbt.offset++]<<8) | nbt.data[nbt.offset++];
                    //console.log("int: "+(int));
                    break;
                case 4:
                    tag.name = NBT.getTagName(nbt, nameLen);
                    //console.log(tagType+" "+name);
                    tag.value = (nbt.data[nbt.offset++]<<56) | (nbt.data[nbt.offset++]<<48) | (nbt.data[nbt.offset++]<<40) | (nbt.data[nbt.offset++]<<32) |
                            (nbt.data[nbt.offset++]<<24) | (nbt.data[nbt.offset++]<<16) | (nbt.data[nbt.offset++]<<8) | nbt.data[nbt.offset++];
                    break;
                case 5:
                    tag.name = NBT.getTagName(nbt, nameLen);
                    //console.log(tagType+" "+name);
                    tag.value = -999;
                    nbt.offset+=4;
                    break;
                case 6:
                    tag.name = NBT.getTagName(nbt, nameLen);
                    //console.log(tagType+" "+name);
                    tag.value = -999;
                    nbt.offset+=8;
                    break;
                case 7:
                    tag.name = NBT.getTagName(nbt, nameLen);
                    //console.log(tagType+" "+name);
                    tag.length = nbt.data[nbt.offset++]*256*256*256 + nbt.data[nbt.offset++]*256*256 + nbt.data[nbt.offset++]*256 + nbt.data[nbt.offset++];
                    //console.log(" "+iid);
                    tag.data = new Uint8Array(tag.length);
                    for (var i = 0; i < tag.length; i++) {
                        tag.data[i] = nbt.data[nbt.offset++];
                    }
                    break;
                case 8:
                    tag.name = NBT.getTagName(nbt, nameLen);
                    tag.value = NBT.getTagName(nbt, nameLen);
                    break;
                case 9:
                    tag.name = NBT.getTagName(nbt, nameLen);
                    //console.log(tagType+" "+name);
                    tag.tagId = nbt.data[nbt.offset++];
                    tag.length = nbt.data[nbt.offset++]*256*256*256 + nbt.data[nbt.offset++]*256*256 + nbt.data[nbt.offset++]*256 + nbt.data[nbt.offset++];
                    //console.log(" "+bid+" "+iid);
                    //nbt.offset+=tag.length*tagOffset[tag.tagId];
                    break;
                case 10:
                    tag.name = NBT.getTagName(nbt, nameLen);
                    break;
                case 11:
                    tag.name = NBT.getTagName(nbt, nameLen);
                    //console.log(tagType+" "+name);
                    tag.length = nbt.data[nbt.offset++]*256*256*256 + nbt.data[nbt.offset++]*256*256 + nbt.data[nbt.offset++]*256 + nbt.data[nbt.offset++];
                    //console.log(" "+iid);
                    tag.data = new Int32Array(tag.length);
                    for (var i = 0; i < tag.length; i++) {
                        tag.data[i] = nbt.data[nbt.offset++]*256*256*256 + nbt.data[nbt.offset++]*256*256 + nbt.data[nbt.offset++]*256 + nbt.data[nbt.offset++];
                    }
                    break;
            }
            //console.log(tag.type+" "+tag.name);
            //if(tag.value !== undefined) console.log("   value: "+tag.value);
            //if(tag.length !== undefined) console.log("   length: "+tag.length);
            //if(tag.tagId !== undefined) console.log("   tagId: "+tag.tagId);
            //if(tag.data !== undefined) console.log(tag.data);
            return tag;
    };
    
NBT.getTagName = function(nbt) {
        var name = "";
        var nameLen = nbt.data[nbt.offset++]*256 + nbt.data[nbt.offset++];
        for (var j = 0; j < nameLen; j++) {
            name += String.fromCharCode(nbt.data[nbt.offset++]);
        }
        return name;
    };
    
NBT.read9 = function(tag, chunk, chunkData){
        //console.log("======== "+tag.name);
        var aTag;
        if(tag.tagId !== 10){
            var tagOffset = [0,1,2,4,8,4,8,0,0,0,0,0];
            for(var itag = 0; itag < tag.length*tagOffset[tag.tagId]; itag++){
                //console.log(chunkData.data[chunkData.offset++]);
                chunkData.offset++;
            }
            //chunkData.offset += tag.length*tagOffset[tag.tagId];
            //console.log("/======== "+tag.name);
            return;
        }    
            
        for(var itag = 0; itag < tag.length; ){
            if((aTag = NBT.nextTag(chunkData)) === -1) {
                break;
            }
            if(aTag.type === 0) {
                itag++;
            }
            if(aTag.type === 9) NBT.read9(aTag, chunk, chunkData);
        }
        //console.log("/======== "+tag.name);
    };
    
NBT.read3RawTag = function(nbt){
     return (nbt.data[nbt.offset++]<<24) | (nbt.data[nbt.offset++]<<16) | (nbt.data[nbt.offset++]<<8) | nbt.data[nbt.offset++];
};

NBT.write0Tag = function(nbt){
    nbt.data[nbt.offset++] = 0;
};  

NBT.write1Tag = function(nbt, name, value){
    nbt.data[nbt.offset++] = 1;
    NBT.writeTagName(nbt, name);
    
    nbt.data[nbt.offset++] = value & 0xFF;
};

NBT.write3Tag = function(nbt, name, value){
    nbt.data[nbt.offset++] = 3;
    NBT.writeTagName(nbt, name);
    
    nbt.data[nbt.offset++] = (value>>24) & 0xFF;
    nbt.data[nbt.offset++] = (value>>16) & 0xFF;
    nbt.data[nbt.offset++] = (value>>8) & 0xFF;
    nbt.data[nbt.offset++] = value & 0xFF;
};

NBT.write5Tag = function(nbt, name, value){
    nbt.data[nbt.offset++] = 5;
    NBT.writeTagName(nbt, name);
    
    var dv = new DataView(nbt.data.buffer, nbt.offset, 4);
    dv.setFloat32(0, value);
    nbt.offset+=4;
};

NBT.write7Tag = function(nbt, name, value){
    nbt.data[nbt.offset++] = 7;
    NBT.writeTagName(nbt, name);
    
    nbt.data[nbt.offset++] = (value.length>>24) & 0xFF;
    nbt.data[nbt.offset++] = (value.length>>16) & 0xFF;
    nbt.data[nbt.offset++] = (value.length>>8) & 0xFF;
    nbt.data[nbt.offset++] = value.length & 0xFF;
    
    for(var i = 0; i < value.length; i++) {
        nbt.data[nbt.offset++] = value[i];
    }
};

NBT.write8Tag = function(nbt, name, value){
    nbt.data[nbt.offset++] = 8;
    NBT.writeTagName(nbt, name);
    NBT.writeTagName(nbt, value);
};

NBT.write9Tag = function(nbt, name, type, value){
    nbt.data[nbt.offset++] = 9;
    NBT.writeTagName(nbt, name);
    nbt.data[nbt.offset++] = type;
    
    nbt.data[nbt.offset++] = (value>>24) & 0xFF;
    nbt.data[nbt.offset++] = (value>>16) & 0xFF;
    nbt.data[nbt.offset++] = (value>>8) & 0xFF;
    nbt.data[nbt.offset++] = value & 0xFF;
};

NBT.write10Tag = function(nbt, name){
    nbt.data[nbt.offset++] = 10;
    NBT.writeTagName(nbt, name);
};

NBT.write11Tag = function(nbt, name, value){
    nbt.data[nbt.offset++] = 11;
    NBT.writeTagName(nbt, name);
    
    nbt.data[nbt.offset++] = (value.length>>24) & 0xFF;
    nbt.data[nbt.offset++] = (value.length>>16) & 0xFF;
    nbt.data[nbt.offset++] = (value.length>>8) & 0xFF;
    nbt.data[nbt.offset++] = value.length & 0xFF;
    
    for(var i = 0; i < value.length; i++) {
        nbt.data[nbt.offset++] = (value[i]>>24) & 0xFF;
        nbt.data[nbt.offset++] = (value[i]>>16) & 0xFF;
        nbt.data[nbt.offset++] = (value[i]>>8) & 0xFF;
        nbt.data[nbt.offset++] = value[i] & 0xFF;
    }
};

NBT.writeTagName = function(nbt, name) {
        var nameLen = name.length;
        nbt.data[nbt.offset++] = Math.floor(nameLen/256);
        nbt.data[nbt.offset++] = nameLen - Math.floor(nameLen/256);
        for (var j = 0; j < nameLen; j++) {
            nbt.data[nbt.offset++] = name.charCodeAt(j);
        }
        return name;
    };