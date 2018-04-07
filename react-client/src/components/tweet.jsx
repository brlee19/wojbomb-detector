import React from 'react';

const tweetStyle = {
  'border': '1px solid blue'
};

const Tweet = ({tweet}) => (
  <div style={tweetStyle}>
  <ul>
    <li>{tweet.userHandle}</li>
    <li>{tweet.text}</li>
    <li>RTs: {tweet.RTs}</li>
    <li><a href={tweet.url}>Link!</a></li>
  </ul>
  </div>
)

export default Tweet;