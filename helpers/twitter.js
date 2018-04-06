const request = require('request');
const Twitter = require('twitter');
const config = require('../config.js');

// const getBearerToken = (cb) => {
//   const key = config.CONSUMER_KEY + ':' + config.CONSUMER_SECRET;
//   console.log('your key is', key);
//   const options = {
//     url: `https://api.twitter.com/oauth2/token`,
//     headers: {
//       //'Host': 'api.twitter.com',
//       //'User-Agent': 'My Twitter App v1.0.23',
//       'Authorization': `Basic ${key} ==`,
//       // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//       // 'Content-Length': '29',
//       'Accept-Encoding': 'gzip'
//     },
//     formData: {'grant_type':'client_credentials'}
//   }
//   request.post(options, (err, res, body) => {
//     if (err) throw err;
//     console.log('res from twitter is', res);
//     console.log('body from twitter is', body);
//     cb(body);
//   });
// }

let client = new Twitter({
  consumer_key: config.CONSUMER_KEY,
  consumer_secret: config.CONSUMER_SECRET,
  access_token_key: config.ACCESS_TOKEN_KEY,
  access_token_secret: config.ACCESS_TOKEN_SECRET
});
 
var params = {screen_name: config.SCREEN_NAME};

const getFaves = (cb) => {
  client.get('favorites/list', function(error, tweets, response) {
    if(error) throw error;
    cb(tweets);
  });
}

// exports.getBearerToken = getBearerToken;
exports.getFaves = getFaves;