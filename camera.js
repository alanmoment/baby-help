var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port['B']);

var image;

module.exports =  = function() {
	this.picture = 
    // Take the picture
    camera.takePicture(function(err, image) {
        if (err) {
            console.log('error taking image', err);
        } else {
            notificationLED.low();
            name = 'picture-' + Math.floor(Date.now() * 1000) + '.jpg';
            console.log('Picture saving as', name, '...');
            process.sendfile(name, image);
            notificationLED.high();
        }
    });

    return image;
}