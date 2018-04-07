const twitter = require('../helpers/twitter.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tweets');

let tweetSchema = mongoose.Schema({
  id: {type: Number, unique: true}, //make unique!
  url: String,
  strId: String, 
  text: String,
  userId: Number,
  userHandle: String,
  RTs: Number,
  hot: Boolean
});

let Tweet = mongoose.model('Tweet', tweetSchema);

const saveTweet = (tweet) => { //will generally be saving 1 tweet at a time, not in a collection
  // if (tweet['possibly_sensitive']) {
  //   console.log('inapprops...sending back empty promise');
  //   return Promise.resolve();
  // }
  return new Tweet({
    id: tweet.id,
    url: `https://twitter.com/${tweet.user.id}/status/${tweet.id_str}`,
    strId: tweet.id_str,
    text: tweet.text,
    userId: tweet.user.id,
    userHandle: tweet.user.screen_name,
    RTs: tweet.retweet_count,
    hot: false
  }).save();
  //return tweet.save(); //returns a promise?
}

const searchTweetById = (id) => { //returns a promise b/c of exec?
  return Tweet.find({id: id})
              .limit(1)
              .exec()
};

const flagTweetAsHot = (id, retweets) => {
  return Tweet.findOneAndUpdate({id: id}, {$set: {RTs: retweets, hot: true}})
}

const getHotTweets = () => {
  return Tweet.find({hot: true}).exec();
}

exports.saveTweet = saveTweet;
exports.searchTweetById = searchTweetById;
exports.flagTweetAsHot = flagTweetAsHot;
exports.getHotTweets = getHotTweets;
// exports.checkRTIncrease = checkRTIncrease;