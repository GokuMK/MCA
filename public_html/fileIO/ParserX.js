function ParserX(){
    
};
        //-----------------------------------
        //Szukanie sekcji
        //-----------------------------------
        ParserX.szukajsekcji1 = function(sh, bufor){
            var b; var i = 0, czytam = 0;
            var poziom = 0;
            var sekcja = "";

            while(bufor.d.length>bufor.p+2)
            {
                b = bufor.d[bufor.p++]; bufor.p++;
                if (b === 40) { poziom++; }
                if (b === 41) { poziom--; }
                if (poziom > 0) continue;
                if (b > 64)
                {
                    czytam = 1;
                    sekcja += String.fromCharCode(b);
                    i++;
                }
                else
                {
                    if (czytam === 1)
                    {
                        if (b === 40) bufor.p-=2;
                        i = 0;
                        //console.log("mam " + sekcja);
                        if (sekcja.toUpperCase() === sh.toUpperCase())
                        {
                            //if (b == '(') ibufor--;
                            for (; ; )
                            {
                                b = bufor.d[bufor.p++]; bufor.p++;
                                if (b === 40)
                                {
                                    return 1;
                                }
                            }
                        }
                        sekcja = "";
                        czytam = 0;
                    }
                }
            }
            console.log("fail");
            return 0;
        };
        //-----------------------------------
        //Szukanie sekcji
        //-----------------------------------
        ParserX.nazwasekcji = function(bufor){
            var b; var i = 0, czytam = 0;
            var poziom = 0;
            var sekcja = "";

            while(bufor.d.length>bufor.p+2){
                b = bufor.d[bufor.p++]; bufor.p++;
                if (b === 40 && czytam === 0) { poziom++; }
                if (b === 41) { poziom--; }
                if (poziom > 0) continue;
                
                if (b > 64)
                {
                    czytam = 1;
                    sekcja += String.fromCharCode(b);
                    i++;
                }
                else
                {
                    if (czytam === 1)
                    {
                        if (b === 40) bufor.p-=2;
                        i = 0;

                        for (; ; )
                        {
                            b = bufor.d[bufor.p++]; bufor.p++;
                            if (b === 40)
                            {
                                return sekcja;
                            }
                        }
                    }
                }
            }
            return "";
        };
        //-----------------------------------
        //Szukanie sekcji
        //-----------------------------------
        ParserX.nazwasekcji_inside = function(bufor){
            var b; var i = 0, czytam = 0;
            var poziom = 0;
            var koniec = false;
            var sekcja = "";
            
            while(bufor.d.length>bufor.p+2){
                b = bufor.d[bufor.p++]; bufor.p++;
                if (b === 40) { poziom++; }
                if (b === 41) { poziom--; }
                if (poziom > 0) continue;
                if (poziom < 0) {
                    bufor.p-=2;
                    return "";
                }
                //console.log("p "+String.fromCharCode(b)+" "+poziom);
                if (b > 64)
                {
                    czytam = 1;
                    sekcja += String.fromCharCode(b);
                    i++;
                }
                else
                {
                    if (czytam === 1)
                    {
                        if (b === 40) bufor.p-=2;
                        i = 0;

                        for (; ; )
                        {
                            b = bufor.d[bufor.p++]; bufor.p++;
                            if (b === 40)
                            {
                                //console.log(sekcja);
                                return sekcja;
                            }
                        }
                    }
                }
            }
            //console.log("sekcja");
            bufor.p-=2;
            return "";
        };
        //-----------------------------------
        //Szukanie 2 sekcji
        //-----------------------------------
        ParserX.szukajsekcji2 = function(sh1, sh2, bufor){
            var b; var i = 0, czytam = 0; 
            var poziom = 0;
            var sekcja = "";

            while(bufor.d.length > bufor.p + 2)
            {
                b = bufor.d[bufor.p++]; bufor.p++;
                if (b === 40 && czytam === 0) { poziom++; }
                if (b === 41 && czytam === 0) { poziom--; }
                if (poziom > 0) continue;
                //if (poziom < 0) return -1;
                if (b > 64)
                {
                    czytam = 1;
                    sekcja += String.fromCharCode(b);
                    i++;
                }
                else
                {
                    if (czytam === 1)
                    {
                        if (b === 40) bufor.p-=2;
                        i = 0;
                        if (sekcja.toUpperCase() === sh1.toUpperCase())
                        {
                            for (; ; )
                            {
                                b = bufor.d[bufor.p++]; bufor.p++;
                                if (b === 40)
                                {
                                    return 1;
                                }
                            }
                        }
                        if (sekcja.toUpperCase() === sh2.toUpperCase())
                        {
                            for (; ; )
                            {
                                b = bufor.d[bufor.p++]; bufor.p++;
                                if (b === 40)
                                {
                                    return 2;
                                }
                            }

                        }
                        sekcja = "";
                        czytam = 0;
                    }
                }
            }
            return -1;
        };
        //-----------------------------------
        //Szukanie n sekcji
        //-----------------------------------
        ParserX.szukajsekcjiN = function(sh, bufor){
            var b; var i = 0, czytam = 0;
            var poziom = 0;
            var sekcja = "";

            while(bufor.d.length > bufor.p+2)
            {
                b = bufor.d[bufor.p++]; bufor.p++;
                if (b === 40) { poziom++; }
                if (b === 41) { poziom--; }
                if (poziom > 0) continue;
                if (poziom < -1) return -1;
                if (b > 64)
                {
                    czytam = 1;
                    sekcja += String.fromCharCode(b);
                    i++;
                }
                else
                {
                    if (czytam === 1)
                    {
                        if (b === 40) bufor.p-=2;
                        i = 0;
                        for (var ii = 0; ii < sh.length; ii++)
                        {
                            if (sekcja.toUpperCase() === sh[ii].toUpperCase())
                            {
                                //if (b == '(') ibufor--;
                                for (; ; )
                                {
                                    b = bufor.d[bufor.p++]; bufor.p++;
                                    if (b === 40)
                                    {
                                        return ii;
                                    }
                                }
                            }
                        }
                        sekcja = "";
                        czytam = 0;
                    }
                }
            }
            return -1;
        };
        //-----------------------------------
        //Pominiecie sekcji
        //-----------------------------------
        ParserX.pominsekcjec = function(bufor){
            var b;
            var poziom = 0;
            while(bufor.d.length>bufor.p+2)
            {
                b = bufor.d[bufor.p++]; bufor.p++;
                if (b === 40) { poziom++; }
                if (b === 41) { poziom--; }
                if (poziom > 0) continue;
                if (poziom < 0) {
                    bufor.p-=2;
                    return -1;
                }
            }
            return 0;
        };
        //-----------------------------------
        //Parsowanie stringa
        //-----------------------------------
        ParserX.odczytajtc = function(bufor){
            var sciezka = "";
            var b = 0;
            while ((b < 46) && (b !== 34)) {
                b = bufor.d[bufor.p++]; bufor.p++;
            }
            //bufor.position(bufor.position()-2); 
            if (b === 34)
            {
                while ((b = bufor.d[bufor.p++]) !== 34)
                {
                    bufor.p++;
                    sciezka += String.fromCharCode(b);
                }
            }
            else
            {
                bufor.p-=2;
                while (((b = bufor.d[bufor.p++]) !== 32) && (b !== 10))
                {
                    bufor.p++;
                    sciezka += String.fromCharCode(b);
                }
            }
            bufor.p++;
            //System.out.println(" --"+sciezka);
            return sciezka;
        };
        //-----------------------------------
        //Parsowanie liczby rzeczywistej
        //-----------------------------------
        ParserX.parsujr = function(bufor){
            var b = 0; var j;
            var x, t;
            var liczba = 1, ujemna = 0;

            while (b < 45 || (b > 45 && b < 48) || b > 57)
            {
                b = bufor.d[bufor.p++]; bufor.p++;
            }
            x = 0;
            liczba = 1;
            ujemna = 0;
            if (b === 45) { 
                ujemna = 1; 
                b = bufor.d[bufor.p++]; bufor.p++;
            }
            while (b > 47 && b < 58)
            {
                x = x * 10 + b - 48;
                b = bufor.d[bufor.p++]; bufor.p++;
            }
            if (b === 46 || b === 44)
            {
                b = bufor.d[bufor.p++]; bufor.p++;
                while (b > 47 && b < 58)
                {
                    liczba = liczba * 10;
                    t = b;
                    x = x + (t - 48) / liczba;
                    b = bufor.d[bufor.p++]; bufor.p++;
                }
            }
            if (ujemna === 1) x = - x;
            if (b === 69 || b === 101)
            {
                b = bufor.d[bufor.p++]; bufor.p++;
                if (b === 45) { 
                    ujemna = 1; 
                    b = bufor.d[bufor.p++]; bufor.p++;
                }
                else ujemna = 0;
                liczba = 0;
                while (b > 47 && b < 58)
                {
                    liczba = liczba * 10 + b - 48;
                    b = bufor.d[bufor.p++]; bufor.p++;
                }
                if (ujemna === 1) { for (j = 0; j < liczba; j++) { x = x / 10; } }
                else { for (j = 0; j < liczba; j++) { x = x * 10; } }
            }
            bufor.p-=2;
            return x;
        };
        //-----------------------------------
        //Parsowanie liczby szesnastkowej
        //-----------------------------------
        ParserX.parsuj16 = function(bufor){
            var b = 0, sb = 0;
            var x;

            while (((b < 48) || (b > 57 && b < 65) || (b > 70 && b < 97) || (b > 102)) || sb !== 32)
            {
                sb = b;
                b = bufor.d[bufor.p++]; bufor.p++;
            }
            x = 0;
            while ((b > 47 && b < 58) || (b > 64 && b < 71) || (b > 96 && b < 103))
            {
                if (b > 96) b = (b - 87 + 48);
                else { if (b > 64) b = (b - 55 + 48); }
                x = x * 16 + b - 48;
                b = bufor.d[bufor.p++]; bufor.p++;
            }
            bufor.p-=2;
            return x;
        };
        //-----------------------------------
        //Pominiecie sekcji
        //-----------------------------------
        ParserX.pominsekcje = function(bufor){
            var b;
            var poziom = 0;
            
            for (var tt=0;tt<1000 ;tt++)
            //for (;;)
            {
                b = bufor.d[bufor.p++]; bufor.p++;
                //System.out.print(b);
                //if (b === 0) { return -3; }
                if (b === 40) { poziom++; }
                if (b === 41) { poziom--; }
                //console.log(",, "+String.fromCharCode(b)+" "+poziom);
                if (poziom < 0) return 0;
            }
        };
        //-----------------------------------
        //Wybranie sekcji primitives
        //-----------------------------------
        ParserX.sekcjap = function(bufor){
	    var b; var i=0, czytam=0;
	    var w;
            var psi = "prim_state_idx";
	    var poziom = 0;
            var sekcja = "";
	
            while(bufor.d.length > bufor.p)
            {
		b = bufor.d[bufor.p++]; bufor.p++;
                if(b===40) {poziom ++;}
                if(b===41) {poziom --;}
                if(poziom>0) continue;
                if(b>65){
                    czytam=1;
                    sekcja += String.fromCharCode(b);
                    i++;
                }
                else{
                    if(czytam===1){
                         i=0;
                         //(sekcja + " bylo");
                         if (sekcja.toUpperCase() === psi.toUpperCase())
                         {
                              w = ParserX.parsujr(bufor);
                              return w;
                         }
                         else {
                              for(;;){
                                  b = bufor.d[bufor.p++]; bufor.p++;
                                  if(b===40){
                                      return -1;
                                  }    
                              }                                                     
                         }                                               
                    }
                }
            }
            return -3;    
        };