const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const twitter = require('../helpers/twitter.js')

let app = express();
app.use(bodyParser());
twitter.streamNBA();

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

app.get('/nba', (req, res) => {
  // twitter.searchNBA(tweets => {
  //   res.send();
  //   // console.log(tweets);
  //   // res.send(tweets);
  // })
  // twitter.streamNBA();
})

app.post('/', (req, res) => { //add user to follow
  console.log(req.body.user);
  res.send('got it');
  //save user into the DB
});

app.get('/*', (req, res) => {
  console.log('url is', req.url);
  twitter.getTweetById(req.url.slice(1), (err, tweet) => {
    console.log('tweet is', tweet);
    res.send('tried searching by id');
  });
});

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});