var exec = require('child_process').exec,
	http = require('http'),
	fs = require('fs');

var filename = '/home/will/testpic.jpg';
var changeBackground = function(filename){
	exec('gsettings set org.gnome.desktop.background picture-uri "file://'+filename + '"');
};

var getRandomImageOf = function(search, cb){
	var flickerApiKey = require('./flickr-creds.json').key;
	var flickerApiSecret = require('./flickr-creds.json').secret;
	var url = "http://api.flickr.com/services/rest/?method=flickr.photos.search";
	url += "&api_key=" + flickerApiKey + "&text=" + search + "&format=json&nojsoncallback=1";
	console.log(url);
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
			if(cb) cb(randomPhoto);
			return randomPhoto;
		});
	});
	req.on('error', logError);
};

var downloadImage = function(res){
	var stream = fs.createWriteStream(filename);
	stream.on('error',logError);
	console.log(res.statusCode);
	res.pipe(stream);
	res.on('end', changeBackground);
	res.on('error', logError);
};

var logError= function(err){
	console.log(err);
};

var imageUrl = function(imgDetails){
	var templateUrl = "http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg";
	return templateUrl.replace('{farm-id}', imgDetails.farm)
		.replace('{server-id}', imgDetails.server)
		.replace('{id}', imgDetails.id)
		.replace('{secret}', imgDetails.secret);
}
//http.get("http://www.flicker.co.uk/images/srpr/logo3w.png", downloadImage);
getRandomImageOf('bottle', function(image){ 
	var url = imageUrl(image);
	console.log(url);
	http.get(url, downloadImage);
});
