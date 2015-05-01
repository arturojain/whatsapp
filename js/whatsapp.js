(function(){
    /*
     * Workflow:
     * 1. New conversation (button, creates handshake sending a link to the other user, only the other user can send a new message) 
     * 2. Encrypt text
     * 3. Decrypt text
     */
    /*
     * we need to have a handshake since we don't know the other user public key, in order to calculate the shared secret
     * URL should be ?msg=X&p=X&g=X&A=X&B=X
     */
    var handshake = function(){
        var variables = setVariables(getParameterByName('p'),getParameterByName('g'),document.cookie,getParameterByName('A'),getParameterByName('B'));
        document.cookie = variables.a;
        return "whatsapp://send?text=" + encodeURIComponent("http://iomediamx.com/cryptowhats?p=" + variables.p + "&g=" + variables.g +
                "&A=" + variables.B + "&B=" + variables.A);
    }
    var decrypt = function(text){
        var variables = setVariables(getParameterByName('p'),getParameterByName('g'),document.cookie,getParameterByName('A'),getParameterByName('B'));
        return CryptoJS.AES.decrypt(text,variables.s).toString(CryptoJS.enc.Utf8);
    };
    var encrypt = function(text){
        var variables = setVariables(getParameterByName('p'),getParameterByName('g'),document.cookie,getParameterByName('A'),getParameterByName('B'));
        document.cookie = variables.a;
        var encrypted = CryptoJS.AES.encrypt(text,variables.s);
        return "whatsapp://send?text=" + encodeURIComponent("http://iomediamx.com/cryptowhats?msg=" + encrypted.toString() + "&p=" + variables.p + "&g=" + variables.g +
                "&A=" + variables.B + "&B=" + variables.A);
    };
    /*
     * p,g are public variables
     * a is a private variable
     * A is our user public variable
     * B is the other user public variable
     */
    var setVariables(p,g,a,A,B){
        if (typeof p === 'undefined') {p = BigInteger(newPrime())}
        if (typeof g === 'undefined') {g = BigInteger(newPrime())}
        //creates new private a if not defined
        if (typeof a === 'undefined') {a = BigInteger(Math.floor((Math.random()*1000)+100))}
        if (typeof A === 'undefined') {A = BigInteger(Math.pow(g, a)%p)}
        var s = Math.pow(B,a)%p;
        return variables = {
            p: p,
            g: g,
            a: a,
            A: A,
            B: B,
            s: s
        }:
    };
    /*
     * Helping function
     */
    var getParameterByName = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1]);
    };
    var newPrime = function(){
        var num = Math.floor((Math.random()*1000)+100);
        var res = (isPrime(num));
        if(res){
            return num;
        } else {
            return newPrime();
        }
    };
    var isPrime = function(){
        if(num==0 || num==1)
            return true;
        if(num==2)
            return true;
        var root=Math.floor(Math.sqrt(num));
        for(var i = 2; i < root+2; i++){
            if(num%i==0){
                return false;
            } 
        }
        return true;
    };
    var primeroots = function(n){
        var o = 1;
        var k;
        var roots = new Array();
        var z = 0;
        for (var r = 2; r < n; r++) {
                k = Math.pow(r, o);
                k %= n;
                while (k > 1) {
                            o++;
                            k *= r;
                            k %= n;
                        }
                if (o == (n - 1)) {
                            roots[z] = r;
                            z++;
                        }
                o = 1;
            }
        return roots;
    };
A)()
