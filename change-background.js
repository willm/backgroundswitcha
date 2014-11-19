var http = require('http'),
	background = require('./background.js'),
	flickr = require('./flickr.js'),
	fs = require('fs');

if(!process.argv[2])
    console.log("usage: node change-background.js [topic] [time interval in seconds]");
else{
    setInterval(function(){
        flickr.randomImageOf(process.argv[2], function(image){ 
            console.log(image.url);
            http.get(image.url, function(responseStream){
                var fileName = '/tmp/background.jpg';
                responseStream.on('error', console.log);
                responseStream.pipe(fs.createWriteStream(fileName));
                responseStream.on('end', function(){background.changeBackground(fileName);});
            });
        });
    }, process.argv[3] * 1000 || 2000);
}
