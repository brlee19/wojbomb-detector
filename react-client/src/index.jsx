import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Tweet from './components/Tweet.jsx';
import Search from './components/Search.jsx';
import axios from 'axios';
// console.log('search is', Search);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      tweets: []
    }
    this.updateHotTweets = this.updateHotTweets.bind(this);
    this.addToStream = this.addToStream.bind(this);
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

  addToStream(term) {
    console.log(`trying to add ${term} to twitter stream`);
    axios.post('/', {query: term})
      .then((resp) => {
        console.log('successful axios post');
      })
      .catch(err => console.log('axios err', err));
  }

  render () {
    if (!this.state.tweets.length) {
      return (
      <div>
        <h1>Hot Tweets</h1>
        <Search search={this.addToStream}/>
      </div>
      )
    }

    return (<div>
      <h1>Hot Tweets</h1>
      <Search tweet={this.state.tweets[0]} search={this.addToStream}/>
      <div>
        {this.state.tweets.reverse().map(tweet => {
          return <Tweet tweet={tweet} key={tweet.id}/>
        })}
      </div>  
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));