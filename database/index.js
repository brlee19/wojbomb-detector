const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tweets');

let tweetSchema = mongoose.Schema({
  id: {type: Number, unique: true}, //make unique!
  text: String,
  userId: Number,
  userHandle: String,
  RTs: Number
});

let Tweet = mongoose.model('Tweet', tweetSchema);

const saveTweet = (tweet) => { //will generally be saving 1 tweet at a time, not in a collection
  return tweet.save(); //returns a promise?
}

const searchTweetById = (id) => { //returns a promise b/c of exec?
  return Tweet.find({id: id})
              .limit(1)
              .exec()
};