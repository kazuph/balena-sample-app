const Gpio = require('pigpio').Gpio;
const PIN = process.env.PIN || 4;
const motor = new Gpio(PIN, { mode: Gpio.OUTPUT });

let pulseWidth = 1000;
let increment = 100;

setInterval(() => {
  console.log("Pulse Width: " + pulseWidth);
  motor.servoWrite(pulseWidth);

  pulseWidth += increment;
  if (pulseWidth >= 2300) {
    increment = -100;
  } else if (pulseWidth <= 500) {
    increment = 100;
  }
}, 1000);