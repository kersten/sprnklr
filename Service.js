var gpio = require('rpi-gpio');

gpio.setup(15, gpio.DIR_OUT, write);

function write() {
    gpio.write(15, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
}
