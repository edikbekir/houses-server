const bodyParser = require("body-parser");
const express = require("express");
import mailer from "./mailer";

const proxy = require("http-proxy-middleware");
const app = express();
var cors = require("cors");

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

app.get("*", (req, res) => {
  res.send(
    'Server is working. Please post at "/api/contact" to submit a message.'
  );
});

app.post("/api/contact", (req, res) => {
  mailer(req.body)
    .then(() => {
      res.header("Access-Control-Allow-Origin", "*");
      return res.status(200);
    })
    .catch((error) => {
      console.log(`${error && error.message}`);
      return res.status(400).send({ error: error.message });
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
