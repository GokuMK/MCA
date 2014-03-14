var Intersection3D = new Object();

Intersection3D.d = new Float32Array(3);
Intersection3D.e1 = new Float32Array(3);
Intersection3D.e2 = new Float32Array(3);
Intersection3D.h = new Float32Array(3);
Intersection3D.s = new Float32Array(3);
Intersection3D.q = new Float32Array(3);    
Intersection3D.v0 = new Float32Array(3);    
Intersection3D.v1 = new Float32Array(3);    
Intersection3D.v2 = new Float32Array(3);    
Intersection3D.p0 = new Float32Array(3);    
Intersection3D.p1 = new Float32Array(3);    
Intersection3D.p2 = new Float32Array(3);    

Intersection3D.vector = function(a,b,c){
	a[0] = b[0] - c[0];
	a[1] = b[1] - c[1];
	a[2] = b[2] - c[2];
    };
    
Intersection3D.dot = function dot(b,c){
        return b[0]*c[0] + b[1]*c[1] + b[2]*c[2];
    };
    
Intersection3D.cross = function cross(a,b,c){
        a[0] = b[1]*c[2] - b[2]*c[1];
        a[1] = b[2]*c[0] - b[0]*c[2]; 
        a[2] = b[0]*c[1] - b[1]*c[0];
    };
Intersection3D.shapeIntersectsShape = function(shape1, shape2, size1, size2, pos){
        var v0 = Intersection3D.v0;
        var v1 = Intersection3D.v1;
        var v2 = Intersection3D.v2;
        var p0 = Intersection3D.p0;
        var p1 = Intersection3D.p1;
        var p2 = Intersection3D.p2;
        
        //var numTriangles1 = shape1.length/3/size1;
        //var numTriangles2 = shape2.length/3/size2;
        var tak = 0;
        
        for(var i = 0; i < shape1.length; i+=3*size1)
            for(var j = 0; j < shape2.length; j+=3*size2){
                v0[0] = shape1[i];          v0[1] = shape1[i+1];            v0[2] = shape1[i+2];
                v1[0] = shape1[i+size1];    v1[1] = shape1[i+1+size1];      v1[2] = shape1[i+2+size1];
                v2[0] = shape1[i+2*size1];  v2[1] = shape1[i+1+2*size1];    v2[2] = shape1[i+2+2*size1];

                p0[0] = shape2[j] +pos[0];          p0[1] = shape2[j+1] +pos[1];            p0[2] = shape2[j+2] +pos[2];
                p1[0] = shape2[j+size2] +pos[0];    p1[1] = shape2[j+1+size2] +pos[1];      p1[2] = shape2[j+2+size2] +pos[2];
                p2[0] = shape2[j+2*size2] +pos[0];  p2[1] = shape2[j+1+2*size2] +pos[1];    p2[2] = shape2[j+2+2*size2] +pos[2];

                tak += Intersection3D.segmentIntersectsTriangle(p0, p1, v0, v1, v2);
                tak += Intersection3D.segmentIntersectsTriangle(p0, p2, v0, v1, v2);
                tak += Intersection3D.segmentIntersectsTriangle(p1, p2, v0, v1, v2);

                tak += Intersection3D.segmentIntersectsTriangle(v0, v1, p0, p1, p2);
                tak += Intersection3D.segmentIntersectsTriangle(v0, v2, p0, p1, p2);
                tak += Intersection3D.segmentIntersectsTriangle(v1, v2, p0, p1, p2);
            }
        return tak;
};
Intersection3D.segmentIntersectsTriangle = function(p, p2, v0, v1, v2) {
        var a,f,u,v;
        Intersection3D.d[0] = p2[0] - p[0];
        Intersection3D.d[1] = p2[1] - p[1];
        Intersection3D.d[2] = p2[2] - p[2];
	Intersection3D.vector(Intersection3D.e1,v1,v0);
	Intersection3D.vector(Intersection3D.e2,v2,v0);
	Intersection3D.cross(Intersection3D.h,Intersection3D.d,Intersection3D.e2);
	//a = Intersection3D.dot(Intersection3D.e1,Intersection3D.h);
        a = Intersection3D.e1[0]*Intersection3D.h[0] 
                + Intersection3D.e1[1]*Intersection3D.h[1] 
                + Intersection3D.e1[2]*Intersection3D.h[2];
        //console.log(a);
        if (a > -0.00001 && a < 0.00001){
           // console.log("to samo p");
            return 0 ;
        }
        f = 1/a;
        Intersection3D.vector(Intersection3D.s,p,v0);
        //u = f * (Intersection3D.dot(Intersection3D.s,Intersection3D.h));
        u = f * (Intersection3D.s[0]*Intersection3D.h[0] 
                + Intersection3D.s[1]*Intersection3D.h[1] 
                + Intersection3D.s[2]*Intersection3D.h[2]);
        //console.log(u);
        if (u < 0.0 || u > 1.0){
            //  console.log("nie trafia u");
            return 0 ;
        }

        Intersection3D.cross(Intersection3D.q,Intersection3D.s,Intersection3D.e1);
        //v = f * Intersection3D.dot(Intersection3D.d,Intersection3D.q);
        v = f * (Intersection3D.d[0]*Intersection3D.q[0] 
                + Intersection3D.d[1]*Intersection3D.q[1] 
                + Intersection3D.d[2]*Intersection3D.q[2]);
        //console.log(v);
        if (v < 0.0 || u + v > 1.0){
            //console.log("nie trafia v");
            return 0 ;
        }

        //var t = f * Intersection3D.dot(Intersection3D.e2,Intersection3D.q);
        var t = f * (Intersection3D.e2[0]*Intersection3D.q[0] 
                + Intersection3D.e2[1]*Intersection3D.q[1] 
                + Intersection3D.e2[2]*Intersection3D.q[2]);
        if (t > 0.00001 && t <= 1.0){
            //console.log(t);
            //console.log("tak");
            return 1 ;
        }

        else {
            //console.log("linia");
            return 0 ;
        }
};