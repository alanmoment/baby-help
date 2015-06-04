// Node requires
var fs = require('fs');
var https = require('https');
var crypto = require('crypto');

// Set up to Tweet
var bound = require('crypto').pseudoRandomBytes(16).toString('hex');
var ctype = 'multipart/form-data; boundary=' + bound;

// Get time
var curtime = parseInt(process.env.DEPLOY_TIMESTAMP || Date.now());

module.exports = function(msg, filename, image) {
    this.msg = msg;
    this.filename = filename;
    this.image = image;
    this.post = function() {
        var req = https.request({
            port: 443,
            method: 'POST',
            hostname: 'slack.com',
            path: '/api/files.upload?channels=C030MA70C&token=xoxp-3021347004-3021347006-4793367232-11b769',
            headers: {
                Host: 'slack.com',
                'Accept': '*/*',
                "User-Agent": "tessel",
                'Content-Type': ctype,
                'Connection': 'keep-alive'
            }
        }, function(res) {
            console.log("statusCode: ", res.statusCode);
            console.log("headers: ", res.headers);

            res.on('data', function(d) {
                console.log(' ');
                console.log(' ');
                console.log(String(d));
            });
        });

        req.write('--' + bound + '\r\n');
        req.write('Content-Disposition: form-data; name="status"\r\n');
        req.write('\r\n');
        req.write(this.msg + '\r\n');
        req.write('--' + bound + '\r\n');
        req.write('Content-Type: application/octet-stream\r\n');
        req.write('Content-Disposition: form-data; name="file"; filename="'+ this.filename +'"\r\n');
        req.write('\r\n');
        req.write(this.image);
        req.write('\r\n');
        req.write('--' + bound + '--\r\n');
        req.end();

        req.on('error', function(e) {
            console.error(e);
        });
    };
}

/*
var tessel = require('tessel');
console.log('Connecting camera...');
var camera = require('camera-vc0706').use(tessel.port['B']);

camera.on('ready', function(err) {
    console.log(err);

    // if (err) return console.log('not ok - error on ready:', err);
    console.log('Camera connected. Setting resolution...');

    // camera.setResolution('vga', function(err) {
        // if (err) return console.log('not ok - error setting resolution:', err);
        // console.log('Resolution set. Setting compression...');

        // camera.setCompression(1, function(err) {
        // if (err) return console.log('not ok - error setting compression:', err);
        // console.log('Compression set.');

        // console.log('Camera ready. Press Config button to take a picture.');

        tessel.led[1].high();
        tessel.button.on('press', function() {
            console.log('Taking picture...');
            tessel.led[3].high();
            camera.setCompression(1, function(err) {
                camera.takePicture(function(err, image) {
                    if (err) return console.log('Error taking Picture:', err);
                    console.log('Picture taken. Posting...');

                    post('Baby is crying...', image);
                    tessel.led[3].low();
                });
            });
        });
        // });
    // });
});

camera.on('error', function(err) {
    console.log('Error: ', err);
});
*/