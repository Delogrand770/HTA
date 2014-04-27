var Zoom = {
	factor:function(amt,imageObj,mapObj){
		var image = XU.El(imageObj);
		image.height = image.height * amt;

		var map = XU.El(mapObj);
		for (var i = 0; i < map.areas.length; i++) {
			var area = map.areas[i];
			var data = area.coords.split(',');
			for (var j = 0; j < data.length; j++) {
				data[j] = data[j] * amt;
			}
			area.coords = data.join(',');
		}
	}
}