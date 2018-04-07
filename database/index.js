const twitter = require('../helpers/twitter.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tweets');

let tweetSchema = mongoose.Schema({
  id: {type: Number, unique: true},//make unique!
  strId: String, 
  text: String,
  userId: Number,
  userHandle: String,
  RTs: Number
});

let Tweet = mongoose.model('Tweet', tweetSchema);

const saveTweet = (tweet) => { //will generally be saving 1 tweet at a time, not in a collection
  return new Tweet({
    id: tweet.id,
    strId: tweet.id_str,
    text: tweet.text,
    userId: tweet.user.id,
    userHandle: tweet.user.screen_name,
    RTs: tweet.retweet_count
  }).save();
  //return tweet.save(); //returns a promise?
}

const searchTweetById = (id) => { //returns a promise b/c of exec?
  return Tweet.find({id: id})
              .limit(1)
              .exec()
};

const checkRTIncrease = (id) => {
  twitter.getTweetById(id);
    //make another get request to twitter by ID
}

exports.saveTweet = saveTweet;
exports.searchTweetById = searchTweetById;
exports.checkRTIncrease = checkRTIncrease;