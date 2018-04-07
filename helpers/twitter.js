const request = require('request');
const Twitter = require('twitter');
const config = require('../config.js');
const db = require('../database/index.js');

/*Sample tweet data
{ created_at: 'Mon Mar 19 19:26:50 +0000 2018',
    id: 975815880268550100,
    id_str: '975815880268550144',
    text: 'OKAY ITS OFFICIAL MY DAD JUST ASKED @rogerfederer IF TENNIS BALLS ARE YELLOW OR GREEN AND HE SAID THEY ARE YELLOW https://t.co/EXdXRr0oFa',
    truncated: false,
    entities: 
     { hashtags: [],
       symbols: [],
       user_mentions: [Array],
       urls: [],
       media: [Array] },
    extended_entities: { media: [Array] },
    source: '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
    in_reply_to_status_id: null,
    in_reply_to_status_id_str: null,
    in_reply_to_user_id: null,
    in_reply_to_user_id_str: null,
    in_reply_to_screen_name: null,
    user: 
     { id: 1319105738,
       id_str: '1319105738',
       name: 'Delaney Dold',
       screen_name: 'delaneyanndold',
       location: 'El Dorado, KS',
       description: 'SC: laneyann99',
       url: 'https://t.co/edk4Bb6FRA',
       entities: [Object],
       protected: false,
       followers_count: 1256,
       friends_count: 1241,
       listed_count: 8,
       created_at: 'Sun Mar 31 20:52:09 +0000 2013',
       favourites_count: 73823,
       utc_offset: -25200,
       time_zone: 'Pacific Time (US & Canada)',
       geo_enabled: true,
       verified: false,
       statuses_count: 12036,
       lang: 'en',
       contributors_enabled: false,
       is_translator: false,
       is_translation_enabled: false,
       profile_background_color: '000000',
       profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
       profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
       profile_background_tile: false,
       profile_image_url: 'http://pbs.twimg.com/profile_images/887456403958493184/Sod3mLpb_normal.jpg',
       profile_image_url_https: 'https://pbs.twimg.com/profile_images/887456403958493184/Sod3mLpb_normal.jpg',
       profile_banner_url: 'https://pbs.twimg.com/profile_banners/1319105738/1497126722',
       profile_link_color: '3B94D9',
       profile_sidebar_border_color: '000000',
       profile_sidebar_fill_color: '000000',
       profile_text_color: '000000',
       profile_use_background_image: false,
       has_extended_profile: true,
       default_profile: false,
       default_profile_image: false,
       following: false,
       follow_request_sent: false,
       notifications: false,
       translator_type: 'none' },
    geo: null,
    coordinates: null,
    place: null,
    contributors: null,
    is_quote_status: false,
    retweet_count: 2151,
    favorite_count: 7719,
    favorited: true,
    retweeted: false,
    possibly_sensitive: false,
    lang: 'en' }

*/

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

const searchNBA = (cb) => {
  client.get('search/tweets', {q: 'nba'}, (err, tweets, res) => {
    // console.log('tweets are', tweets.statuses);
    const date = new Date();
    console.log('current date is', date);
    mappedTweets = (tweets.statuses).map(tweet => {
      return {
        tweetId: tweet.id,
        text: tweet.text,
        user: tweet.user.id,
        screenName: tweet.user.screen_name,
        RTs: [{date: new Date(), retweets: tweet.retweet_count}] //need to store dates with RTs to compare
        //faves: {faves: tweet.favorite_count}
        //need to save current time too
      };
      // return tweet
    });
    console.log('tweets are', JSON.stringify(mappedTweets));
    cb(mappedTweets);
  });
}

const streamNBA = () => {
  const params = {
    follow: '50323173, 178580925, 1071182324, 23378774, 30074516' //should be based on user input and who they want to follow
    //track: 'NBA'
  };

  console.log('streaming from twitter');

  client.stream('statuses/filter', params, function(stream) {
    stream.on('data', function(tweet) {
      if (tweet.text.slice(0,2) !== 'RT') { // check it's not RT
        //console.log('trying to save tweet');
        db.saveTweet(tweet)
          .then(() => {
            console.log('saved tweet successfully');
          })
          .catch(() => {
            console.log('unable to save tweet in DB :(');
          })
      }
      // console.log(tweet.text);
      // add tweet to db
      // setTimeout for x minutes
      // check up on tweet again
        // if hot, render to client
        // if not, delete from DB
  });

  stream.on('error', function(error) {
    console.log(error);
  });
  });
}

// exports.getBearerToken = getBearerToken;
exports.getFaves = getFaves;
exports.searchNBA = searchNBA;
exports.streamNBA = streamNBA;

// SAMPLE RT

// { created_at: 'Fri Apr 06 22:22:07 +0000 2018',
//   id: 982382974069960700,
//   id_str: '982382974069960704',
//   text: 'RT @wojespn: My ride to a Raptors game in the @Klow7-mobile: https://t.co/jGZ0paEwAI',
//   source: '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
//   truncated: false,
//   in_reply_to_status_id: null,
//   in_reply_to_status_id_str: null,
//   in_reply_to_user_id: null,
//   in_reply_to_user_id_str: null,
//   in_reply_to_screen_name: null,
//   user: 
//    { id: 262917876,
//      id_str: '262917876',
//      name: '🌶',
//      screen_name: 'rapsciity',
//      location: 'toronto',
//      url: null,
//      description: '@raptors | 18 | 56-22',
//      translator_type: 'regular',
//      protected: false,
//      verified: false,
//      followers_count: 12025,
//      friends_count: 208,
//      listed_count: 51,
//      favourites_count: 28615,
//      statuses_count: 59101,
//      created_at: 'Wed Mar 09 01:02:36 +0000 2011',
//      utc_offset: -10800,
//      time_zone: 'Atlantic Time (Canada)',
//      geo_enabled: true,
//      lang: 'en',
//      contributors_enabled: false,
//      is_translator: false,
//      profile_background_color: '1A1B1F',
//      profile_background_image_url: 'http://pbs.twimg.com/profile_background_images/378800000177936385/08y5XH-o.jpeg',
//      profile_background_image_url_https: 'https://pbs.twimg.com/profile_background_images/378800000177936385/08y5XH-o.jpeg',
//      profile_background_tile: true,
//      profile_link_color: '1A1B1F',
//      profile_sidebar_border_color: 'FFFFFF',
//      profile_sidebar_fill_color: 'DAECF4',
//      profile_text_color: '663B12',
//      profile_use_background_image: true,
//      profile_image_url: 'http://pbs.twimg.com/profile_images/978820478704926720/DWePinsu_normal.jpg',
//      profile_image_url_https: 'https://pbs.twimg.com/profile_images/978820478704926720/DWePinsu_normal.jpg',
//      profile_banner_url: 'https://pbs.twimg.com/profile_banners/262917876/1522204078',
//      default_profile: false,
//      default_profile_image: false,
//      following: null,
//      follow_request_sent: null,
//      notifications: null },
//   geo: null,
//   coordinates: null,
//   place: null,
//   contributors: null,
//   retweeted_status: 
//    { created_at: 'Fri Apr 06 20:19:42 +0000 2018',
//      id: 982352167196557300,
//      id_str: '982352167196557312',
//      text: 'My ride to a Raptors game in the @Klow7-mobile: https://t.co/jGZ0paEwAI',
//      source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
//      truncated: false,
//      in_reply_to_status_id: null,
//      in_reply_to_status_id_str: null,
//      in_reply_to_user_id: null,
//      in_reply_to_user_id_str: null,
//      in_reply_to_screen_name: null,
//      user: 
//       { id: 50323173,
//         id_str: '50323173',
//         name: 'Adrian Wojnarowski',
//         screen_name: 'wojespn',
//         location: null,
//         url: 'http://es.pn/2BrPJmN',
//         description: 'ESPN Senior NBA Insider. http://ESPN.com. SportsCenter. NBA Countdown. Host of The Woj Pod.',
//         translator_type: 'none',
//         protected: false,
//         verified: true,
//         followers_count: 2289260,
//         friends_count: 627,
//         listed_count: 24260,
//         favourites_count: 4692,
//         statuses_count: 13741,
//         created_at: 'Wed Jun 24 14:43:40 +0000 2009',
//         utc_offset: -14400,
//         time_zone: 'Eastern Time (US & Canada)',
//         geo_enabled: false,
//         lang: 'en',
//         contributors_enabled: false,
//         is_translator: false,
//         profile_background_color: '642D8B',
//         profile_background_image_url: 'http://pbs.twimg.com/profile_background_images/679082751690039297/ArImomTA.jpg',
//         profile_background_image_url_https: 'https://pbs.twimg.com/profile_background_images/679082751690039297/ArImomTA.jpg',
//         profile_background_tile: true,
//         profile_link_color: 'FF0000',
//         profile_sidebar_border_color: 'FFFFFF',
//         profile_sidebar_fill_color: 'DDFFCC',
//         profile_text_color: '333333',
//         profile_use_background_image: true,
//         profile_image_url: 'http://pbs.twimg.com/profile_images/973551069404987392/Ftpo7Rg5_normal.jpg',
//         profile_image_url_https: 'https://pbs.twimg.com/profile_images/973551069404987392/Ftpo7Rg5_normal.jpg',
//         profile_banner_url: 'https://pbs.twimg.com/profile_banners/50323173/1501272451',
//         default_profile: false,
//         default_profile_image: false,
//         following: null,
//         follow_request_sent: null,
//         notifications: null },
//      geo: null,
//      coordinates: null,
//      place: null,
//      contributors: null,
//      is_quote_status: false,
//      quote_count: 22,
//      reply_count: 21,
//      retweet_count: 126,
//      favorite_count: 607,
//      entities: 
//       { hashtags: [],
//         urls: [Array],
//         user_mentions: [Array],
//         symbols: [] },
//      favorited: false,
//      retweeted: false,
//      possibly_sensitive: false,
//      filter_level: 'low',
//      lang: 'en' },
//   is_quote_status: false,
//   quote_count: 0,
//   reply_count: 0,
//   retweet_count: 0,
//   favorite_count: 0,
//   entities: 
//    { hashtags: [],
//      urls: [ [Object] ],
//      user_mentions: [ [Object], [Object] ],
//      symbols: [] },
//   favorited: false,
//   retweeted: false,
//   possibly_sensitive: false,
//   filter_level: 'low',
//   lang: 'en',
//   timestamp_ms: '1523053327468' }



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