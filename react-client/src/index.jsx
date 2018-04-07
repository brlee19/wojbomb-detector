import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Tweet from './components/Tweet.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      tweets: []
    }
    this.updateHotTweets = this.updateHotTweets.bind(this);
    setInterval(() => {
      this.updateHotTweets();
    }, 5000);
  }

  updateHotTweets() {
    console.log('checking for hot tweets!')
    axios.get('/hot')
      .then((resp) => {
        this.setState({tweets: resp.data});
      })
      .catch(err => console.log('axios err', err));
  }

  componentDidMount() {
    this.updateHotTweets();
  }

  render () {
    if (!this.state.tweets.length) return (<div></div>)
    return (<div>
      <h1>Hot Tweets</h1>
      {this.state.tweets.map(tweet => {
        return <Tweet tweet={tweet} key={tweet.id}/>
      })}  
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));