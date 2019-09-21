orders = getSynchronizedArray(database.ref('settings/hashtags'),function() {
		}, function() {}, function() {
	if(orders.length > 0)
	{
		console.log(orders);
		doSetTimeout(orders,0,orders.length);
	}
	
});

doSetTimeout= function(orders,i,max) {
	if( i == max) i=0;
	setTimeout(function() { 
		//console.log(orders[i].tag);
		var sign = document.getElementById("tag_sign");
		sign.getElementsByTagName("b")[1].innerHTML = '';
		sign.getElementsByTagName("b")[1].append(" #"+orders[i].tag);
		var feeded = document.getElementById("instafeed");
		feeded.innerHTML = '';
		var feed = new Instafeed({
			get: 'tagged',
			tagName: orders[i].tag,
			//userId: 'self',
			limit: "18",
	        accessToken: "1199257985.932c054.0799433ce015442288874c5220e5e337"
        });
        feed.run();
		doSetTimeout(orders,++i,max)
	}, 7900);
}