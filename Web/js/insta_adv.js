orders = getSynchronizedArray(database.ref('settings/hashtags'),function() {
		}, function() {}, function() {
	if(orders.length > 0)
	{
		console.log(orders);
		doSetTimeout(orders,0,orders.length);
	}
	
});
timer = 1000;
doSetTimeout= function(orders,i,max) {
	if( i == max) i=0;
	setTimeout(function() { 
		//console.log(orders[i].tag);
		var sign = document.getElementById("tag_sign");
		if(i > 0){
			timer = 120000;
			sign.getElementsByTagName("b")[1].innerHTML = '';
			sign.getElementsByTagName("b")[1].append(" #"+orders[i-1].tag);
		}
		if(i == 0){
			sign.getElementsByTagName("b")[1].innerHTML = '';
			sign.getElementsByTagName("b")[1].append(" #"+orders[max-1].tag);
		}		
		var feeded = document.getElementById("instafeed").getElementsByTagName("a");
		//feeded.innerHTML = '';
		var feed = new Instafeed({
			get: 'tagged',
			tagName: orders[i].tag,
			//userId: 'self',
			limit: "13",
	        accessToken: "1199257985.932c054.0799433ce015442288874c5220e5e337"
        	});
        	feed.run();
		if(feeded.length > 0){
			var cln;
			for(var j=0; j<feeded.length; j++){
				cln = feeded[j].firstChild.cloneNode();
				switch(j) {
    					case 1:
						document.getElementById("leftSubDiv1").innerHTML='';
						document.getElementById("leftSubDiv1").append(cln);
					        break;
					case 2:
					        document.getElementById("leftSubDiv2").innerHTML='';
						document.getElementById("leftSubDiv2").append(cln);
					        break;
					case 3:
        					document.getElementById("leftSubDiv3").innerHTML='';
						document.getElementById("leftSubDiv3").append(cln);
					        break;
					case 4:
					        document.getElementById("leftSubDiv4").innerHTML='';
						document.getElementById("leftSubDiv4").append(cln);
					        break;
					case 5:
        					document.getElementById("leftSubDiv5").innerHTML='';
						document.getElementById("leftSubDiv5").append(cln);
					        break;
					case 6:
					        document.getElementById("leftSubDiv6").innerHTML='';
						document.getElementById("leftSubDiv6").append(cln);
					        break;
					case 7:
        					document.getElementById("leftSubDiv7").innerHTML='';
						document.getElementById("leftSubDiv7").append(cln);
					        break;
					case 8:
					        document.getElementById("midSubDiv1").innerHTML='';
						document.getElementById("midSubDiv1").append(cln);
					        break;
					case 9:
        					document.getElementById("midSubDiv2").innerHTML='';
						document.getElementById("midSubDiv2").append(cln);
					        break;
					case 10:
					        document.getElementById("midSubDiv3").innerHTML='';
						document.getElementById("midSubDiv3").append(cln);
					        break;
					case 11:
        					document.getElementById("midSubDiv4").innerHTML='';
						document.getElementById("midSubDiv4").append(cln);
					        break;
					case 12:
					        document.getElementById("rightSubDiv1").innerHTML='';
						document.getElementById("rightSubDiv1").append(cln);
					        break;
					case 13:
        					document.getElementById("rightSubDiv2").innerHTML='';
						document.getElementById("rightSubDiv2").append(cln);
					        break;
					default:
						break; 
				}
			}
			document.getElementById("instafeed").innerHTML = '';
		}
		doSetTimeout(orders,++i,max)
	}, timer);
}