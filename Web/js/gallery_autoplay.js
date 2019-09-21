var slideIndex = 0;
carousel();

function carousel() {
    var i;
    var cln;
    var lP = document.getElementById("leftPic");
    var lMP = document.getElementById("leftMidPic");
    var rP = document.getElementById("rightPic");
    var rMP = document.getElementById("rightMidPic");
    var mP = document.getElementById("mainPic");
    if (lP.length != 0) {
        lP.innerHTML = '';
    }
    if (lP.length != 0) {
        lMP.innerHTML = '';
    }
    if (lP.length != 0) {
        rP.innerHTML = '';
    }
    if (lP.length != 0) {
        rMP.innerHTML = '';
    }
    if (lP.length != 0) {
        mP.innerHTML = '';
    }
    var x = document.getElementById("buffer").getElementsByTagName("img");
    if(x.length == 0){
	setTimeout(carousel, 100);
    }
    else{
    	slideIndex++;
	    if (slideIndex - 2 < 0) {
	       cln = x[slideIndex - 2 + x.length].cloneNode();
           rMP.appendChild(cln);
	    }
	    else {
           cln = x[slideIndex - 2].cloneNode();
	       rMP.appendChild(cln);
	    }
	    if (slideIndex - 3 < 0) {
           cln = x[slideIndex - 3 + x.length].cloneNode();
	       rP.appendChild(cln);
	    }	
	    else {
       	   cln = x[slideIndex - 3].cloneNode();
	       rP.appendChild(cln);
	    }	
	    if (slideIndex > x.length - 1) {
	       cln = x[slideIndex - x.length].cloneNode();
           lMP.appendChild(cln);
	    }
	    else {
           cln = x[slideIndex].cloneNode();
	       lMP.appendChild(cln);
	    }
        if (slideIndex + 1 > x.length - 1) {
    	    cln = x[slideIndex + 1 - x.length].cloneNode();
            lP.appendChild(cln);
    	}
    	else {
            cln = x[slideIndex + 1].cloneNode();
            lP.appendChild(cln);
        }
        if (slideIndex > x.length) {
            slideIndex = 1;
        }
        cln = x[slideIndex - 1].cloneNode();
        mP.appendChild(cln);
        setTimeout(carousel, 2000); // Change image every 2 seconds
    }
}