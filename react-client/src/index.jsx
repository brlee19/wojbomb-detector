import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Tweet from './components/Tweet.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      tweets: []
    }
  }

  componentDidMount() {
    $.ajax({
      url: '/hot', 
      success: (tweets) => {
        this.setState({
          tweets: tweets
        });
        console.log('first tweet');
      },
      error: (err) => {
        console.log('err', err);
      }
    });
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