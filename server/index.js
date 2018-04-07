const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const twitter = require('../helpers/twitter.js');
const db = require('../database/index.js');
let app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// twitter.stream('NBA');

app.get('/hot', (req, res) => { 
  return db.getHotTweets().then((data) => {
      // console.log(`data from getHotTweets is ${data}`);
      res.send(data);
    }).catch(err => {
      console.log(err);
      res.end();
    });
})

app.post('/*', (req, res) => { //add user to follow
  console.log('post request body is', req.body);
  //NEED TO CLOSE THE ORIGINAL STREAM
  // console.log('nba stream is', nbaStream);
  twitter.stream(req.body.query);
  res.send('got it');
  //save user into the DB
});

// app.get('/*', (req, res) => {
//   console.log('url is', req.url);
//   twitter.getTweetById(req.url.slice(1), (err, tweet) => {
//     console.log('tweet is', tweet);
//     res.send('tried searching by id');
//   });
// });

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});