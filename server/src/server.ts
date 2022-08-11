import express from "express";
import webPush from "web-push";
import "dotenv/config";

// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
// https://tools.ietf.org/html/draft-ietf-webpush-encryption.

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log(
    "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
      "environment variables. You can use the following ones:"
  );
  const { publicKey, privateKey } = webPush.generateVAPIDKeys();
  console.log(`VAPID_PUBLIC_KEY=${publicKey}`);
  console.log(`VAPID_PRIVATE_KEY=${privateKey}`);
  process.exit(1);
}
// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  "https://serviceworke.rs/",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const app = express();

app.get("/pubkey", (_, res) => {
  res.json({ pubkey: process.env.VAPID_PUBLIC_KEY });
});

app.post("/register", (req, res) => {
  // Store subscription info here
  res.status(201).send();
});

app.post("/sendNotification", function (req, res) {
  // This will have to change a lot
  const subscription = req.body.subscription;
  const payload = req.body.payload;
  const options = {
    TTL: req.body.ttl,
  };

  setTimeout(function () {
    webPush
      .sendNotification(subscription, payload, options)
      .then(function () {
        res.sendStatus(201);
      })
      .catch(function (error) {
        console.log(error);
        res.sendStatus(500);
      });
  }, req.body.delay * 1000);
});

const port = parseInt(process.env.PORT) || 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
