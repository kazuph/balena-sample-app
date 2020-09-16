const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();

const GoogleHomeNotifier = require('@shooontan/google-home-notifier');
const DEVICE_NAME = process.env.DEVICE_NAME || 'Google Home';
const DEVICE_IP = process.env.DEVICE_IP || undefined;
const notifier = GoogleHomeNotifier({
  device: DEVICE_NAME,
  ip: DEVICE_IP,
  lang: 'ja',
});
notifier.create();

app.get('/', (req, res) => {
  res.send('<form action="/notifier" method="post"><input type="text" name="text" value="" placeholder="喋らせたい言葉 or URL" /><input type="submit" value="send" /></form>');
});

app.post('/notifier', urlencodedParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);

  console.log(req.body);
  const text = req.body.text;

  if (text) {
    try {
      notify(text);
      res.send('say: ' + text + '\n');
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  } else {
    res.send('Please GET "text=Hello Google Home"');
  }
});

app.listen(80, () => {
  console.log('Server running on port 3000');
});

async function notify(text) {
  if (text.startsWith('http')) {
    await notifier.play(text);
  } else {
    await notifier.say(text);
  }
}