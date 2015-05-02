(function(){
    var $startConversation = $('#start-conversation');
    var $startConversationLink = $('#start-conversation-link');
    var $encrypt = $('#encrypt');
    var $encryptLink = $('#encrypt-link');
    var $decrypt = $('#decrypt');
    var $inputText = $('#input-text');
    var $outputText = $('#output-text');

    $encrypt.click(function(){
        $encryptLink.attr('href', encrypt($inputText.val()));
    });
    //$decrypt.click(function(){
        //$outputText.val(decrypt(getParameterByName('msg')));
    //});
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
        var variables = initializeVariables(readCookie("a"));
        createCookie("a", variables.a, 7);
        return "whatsapp://send?text=" + encodeURIComponent("http://iomediamx.com/secure?p=" + variables.p + "&g=" + variables.g
                + "&B=" + variables.A);
    }
    var decrypt = function(text){
        var variables = setVariables(getParameterByName('p'),getParameterByName('g'),readCookie("a"),getParameterByName('A'),getParameterByName('B'));
        return CryptoJS.AES.decrypt(text,variables.s).toString(CryptoJS.enc.Utf8);
    };
    var encrypt = function(text){
        var variables = setVariables(getParameterByName('p'),getParameterByName('g'),readCookie("a"),getParameterByName('A'),getParameterByName('B'));
        createCookie("a", variables.a, 7);
        var encrypted = CryptoJS.AES.encrypt(text,""+variables.s);
        return "whatsapp://send?text=" + encodeURIComponent("http://iomediamx.com/secure?msg=" + encrypted.toString() + "&p=" + variables.p + "&g=" + variables.g +
                "&A=" + variables.B + "&B=" + variables.A);
    };
    /*
     * p,g are public variables
     * a is a private variable
     * A is our user public variable
     * B is the other user public variable
     */
    var initializeVariables = function(a){
        var p = BigInteger(newPrime());
        var g = BigInteger(newPrime());
        if (typeof a === 'undefined' || a === null) {a = BigInteger(Math.floor((Math.random()*100)+10))}
        //if (A == "") {A = BigInteger(Math.pow(g, a)%p)}
        var A = g.pow(a);
        A = A.remainder(p);
        return variables = {
            p: p.toString(),
            g: g.toString(),
            a: a.toString(),
            A: A.toString()
        };
    };
    var setVariables = function(p,g,a,A,B){
        if (p == "") {p = BigInteger(newPrime())}else{p = BigInteger(p)};
        if (g == "") {g = BigInteger(newPrime())}else{g = BigInteger(g)};
        //creates new private a if not defined
        if (typeof a === 'undefined' || a === null) {a = BigInteger(Math.floor((Math.random()*100)+10))}else{a = BigInteger(a)};
        //if (A == "") {A = BigInteger(Math.pow(g, a)%p)}
        if (A == "") {
            A = g.pow(a);
            A = A.remainder(p);
        }else{
            A = BigInteger(A)
        };
        var B = BigInteger(B);
        var s = B.pow(a);
        s = s.remainder(p);
        return variables = {
            p: p.toString(),
            g: g.toString(),
            a: a.toString(),
            A: A.toString(),
            B: B.toString(),
            s: s.toString()
        };
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
        var num = Math.floor((Math.random()*100)+10);
        var res = (isPrime(num));
        if(res){
            return num;
        } else {
            return newPrime();
        }
    };
    var isPrime = function(num){
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
    var createCookie = function(name,value,days) {
        if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
            }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }
    var readCookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
        return null;
    }
    var eraseCookie = function(name) {
        createCookie(name,"",-1);
    }

    if(getParameterByName('B') == ""){
        $startConversationLink.attr('href', handshake());
    } else {
        $startConversation.hide();
        if(getParameterByName('msg') != ""){
            //$inputText.val(getParameterByName('msg'));
            $inputText.val(decrypt(getParameterByName('msg')));
        }
    }
})();
