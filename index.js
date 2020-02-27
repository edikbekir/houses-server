const bodyParser = require('body-parser')
const express = require('express')
import mailer from './mailer';

const proxy = require('http-proxy-middleware');
const app = express();
var cors = require('cors');

var whitelist = ['https://glacial-shore-23815.herokuapp.com', 'http://localhost:3000', 'http://localhost:3001']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('*', (req, res) => {
  res.send('Server is working. Please post at "/contact" to submit a message.')
})

app.post('/api/contact', (req, res) => {
  mailer(req.body).then(() => {
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200);
  }).catch((error) => {
    console.log(`${error && error.message}`);
    return res.status(400).send({ error: error.message});
  })
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
})
