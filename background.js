var exec = require('child_process').exec;

exports.changeBackground = function(filename){
	var command = 'gsettings set org.gnome.desktop.background picture-uri "file://'+filename + '"';
	console.log(command);
	exec(command);
};
