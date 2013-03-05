var http = require('http'),
	background = require('./background.js'),
	flickr = require('./flickr.js'),
	fs = require('fs');

var downloadImage = function(res){
	var filename = '/tmp/background.jpg';
	var stream = fs.createWriteStream(filename);
	stream.on('error', logError);
	console.log(res.statusCode);
	res.pipe(stream);
	res.on('end', function(){
		background.changeBackground(filename);
	});
	res.on('error', logError);
};

var logError= function(err){
	console.log(err);
};

setInterval(function(){
	flickr.randomImageOf(process.argv[2], function(image){ 
		console.log(image.url);
		http.get(image.url, downloadImage);
	});
}, 20000);
