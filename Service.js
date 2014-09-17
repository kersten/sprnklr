var async = require('async'),
    mac = require('getmac'),
    gpio = require('rpi-gpio'),
    gpios = [7, 11, 12, 13, 15, 16, 18, 22];
    request = require('request'),
    proc = require('node-proc'),
    cache = {};

async.parallel({
    off: function (done) {
        async.each(gpios, function (single, done) {
            gpio.setup(single, gpio.DIR_OUT, function () {
                gpio.write(single, false, done);
            });
        }, done);
    },

    serial: function (done) {
        proc.cpuinfo(done);
    },

    mac: function (done) {
        mac.getMac(done);
    }
}, function (err, info) {
    console.log(err, info);

    async.forever(
        function(next) {
            request('http://garden.sprnklr.de/system', {
                method: 'POST',
                json: {
                    serial: info.serial[1].Serial,
                    mac: info.mac
                }
            }, function (err, r, body) {
                if (cache !== body) {
                    async.each(gpios, function (single, done) {
                        if (cache[single] !== body[single]) {
                            gpio.setup(single, gpio.DIR_OUT, function () {
                                gpio.write(single, body[single], done);
                            });
                        } else {
                            done(null);
                        }
                    }, function () {
                        setTimeout(next, 3000);
                    });
                } else {
                    setTimeout(next, 3000);
                }
            });
        },
        function(err) {
            // if next is called with a value in its first parameter, it will appear
            // in here as 'err', and execution will stop.
        }
    );
});