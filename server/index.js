const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const twitter = require('../helpers/twitter.js')

let app = express();
app.use(bodyParser());

app.get('/', (req, res) => {
  console.log('get request for index.html');
  res.send('Hello world!');
});

// app.get('/bearer', (req, res) => {
//   console.log('trying to get bearer token YOLO');
//   twitter.getBearerToken((token) => {
//     console.log('token is', token);
//   });
//   res.send('tried to get bearer token');
// });

app.get('/faves', (req, res) => {
  twitter.getFaves(tweets => {
    let tweetText = tweets.map(tweet => {
      return tweet.text;
    })
    res.send(tweetText);
  });
})

app.post('/', (req, res) => { //add user to follow
  console.log(req.body.user);
  res.send('got it');
  //save user into the DB
});

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});