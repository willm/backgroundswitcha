var http = require('https');

var logError= function(err){
	console.log(err);
};

var searchForImagesOf = function(search){
	var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search";
	var flickrApi = require('./flickr-creds.json');
	url += "&api_key=" + flickrApi.key + "&text=" + search + "&format=json&nojsoncallback=1";
	return url;
};

var imageUrl = function(imgDetails){
	var templateUrl = "http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_b.jpg";
	return templateUrl.replace('{farm-id}', imgDetails.farm)
		.replace('{server-id}', imgDetails.server)
		.replace('{id}', imgDetails.id)
		.replace('{secret}', imgDetails.secret);
};

exports.randomImageOf = function(search, cb){
	var url = searchForImagesOf(search);
	var req = http.get(url, function(res){
		var results = '';
		console.log(res.statusCode);
		res.setEncoding('utf-8');
		
		res.on('data', function(data){
			results += data;
		});
		res.on('end', function(){
			var photos = JSON.parse(results).photos.photo;
			var randomPhoto = photos[Math.floor(Math.random() * photos.length - 1)];
			console.log(randomPhoto);
			if(cb) cb({url: imageUrl(randomPhoto)});
		});
	});
	req.on('error', logError);
};
