const request = require('request');
const Twitter = require('twitter');
const config = require('../config.js');
const db = require('../database/index.js');

let client = new Twitter({
  consumer_key: config.CONSUMER_KEY,
  consumer_secret: config.CONSUMER_SECRET,
  access_token_key: config.ACCESS_TOKEN_KEY,
  access_token_secret: config.ACCESS_TOKEN_SECRET
});
 
const params = {screen_name: config.SCREEN_NAME};
const rtInterval = 60000; // the interval after which to recheck a tweet
const rtDif = 1; //the number of rts during the interval that make a tweet count as hot

const stream = (query) => {
  //To do: add these to a db too and add an option to easily add new people to follow this way
  const params = {
    // follow: '50323173, 178580925, 1071182324, 23378774, 30074516, 772164285388709888, 416814339' //should be based on user input and who they want to follow
    track: query
  };

  console.log('streaming from twitter');

  client.stream('statuses/filter', params, function(stream) {
    stream.on('data', function(tweet) {
      if (tweet.text.slice(0,2) !== 'RT') {
        db.saveTweet(tweet)
          .then((data) => {
            // console.log('saved tweet successfully');
            // console.log('data here is', data); //data is tweet model
            //console.log(`# of RTs of tweet ${data.url} at ${new Date()} is ${data.RTs}`);
            setTimeout(function() {
              checkRTIncrease(data.strId, data.RTs);
            }, rtInterval);
          })
          .catch(() => {
            console.log('unable to save tweet in DB :(');
          })
      }
  });

  stream.on('error', function(error) {
    console.log(error);
  });
  });
}

const checkRTIncrease = (id, oldRetweetCount) => {
  getTweetById(id, (err, tweet) => {
    // console.log(tweet);
    if (err) console.log(err);
    else {
      const retweetDifference = tweet.retweet_count - oldRetweetCount;
      //console.log(`# of RTs of tweet ${tweet.id} at ${new Date()} is ${tweet.retweet_count}, a difference of ${retweetDifference}`);
      if (retweetDifference >= rtDif) {
        console.log('hot tweet found!');
        db.flagTweetAsHot(tweet.id, tweet.retweet_count).exec((err, data) => {
          if (err) console.log(err);
          if (data) console.log('saved hot tweet');
        });
      }
      //if enough of a difference, change the hot field to true (get request by client later returns only these hot tweets)
    }
  });
    //make another get request to twitter by ID
}

const getTweetById = (strId, cb) => {
  client.get('statuses/show', {id: strId}, function(error, tweet, response) {
    if (error) {
      console.log(error);
      cb(error, null);
    }
    else {
      // console.log('searched for tweet by id and got', tweet);
      cb(null, tweet);
    }
    // console.log(tweet);  
    // console.log(response);  
  });
}

// exports.getBearerToken = getBearerToken;
// exports.getFaves = getFaves;
// exports.searchNBA = searchNBA;
exports.stream = stream;
exports.getTweetById = getTweetById;