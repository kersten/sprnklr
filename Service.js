var async = require('async'),
    gpio = require('rpi-gpio'),
    isOn = true;

async.forever(
    function(next) {
        gpio.setup(15, gpio.DIR_OUT, write);

        function write () {
            if (isOn) {
                isOn = false;
            } else {
                isOn = true;
            }

            gpio.write(15, isOn, function (err) {
                if (err) throw err;

                setTimeout(next, 3000);
            });
        }
    },
    function(err) {
        // if next is called with a value in its first parameter, it will appear
        // in here as 'err', and execution will stop.
    }
);

