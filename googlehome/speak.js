const GoogleHomeNotifier = require('@shooontan/google-home-notifier');

(async () => {
  const notifier = GoogleHomeNotifier({ lang: 'ja' });
  await notifier.create();

  const message = 'こんにちわ';
  await notifier.say(message);
})();