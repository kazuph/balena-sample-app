const Gpio = require('pigpio').Gpio;
const PIN = process.env.PIN || 4;
const motor = new Gpio(PIN, { mode: Gpio.OUTPUT });

const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();

app.get('/', (req, res) => {
  res.send('<form action="/pulseWidth" method="post"><input type="text" name="pulseWidth" value="" placeholder="500~2500(Int)" /><input type="submit" value="send" /></form>');
});

app.post('/pulseWidth', urlencodedParser, (req, res) => {
  console.log("[POST]req.body: ", req.body);

  let pulseWidth = parseInt(req.body.pulseWidth);
  if (pulseWidth <= 500) pulseWidth = 500;
  if (pulseWidth >= 2500) pulseWidth = 2500;
  motor.servoWrite(pulseWidth);

  res.redirect('/');
});

app.listen(4000, () => {
  console.log(`[SERVO WEB]Start Server`);
});
