import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
// import List from './components/List.jsx';

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
      success: (data) => {
        this.setState({
          tweets: data
        })
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  render () {
    return (<div>
      <h1>Item List</h1>
      <pre>{this.state.tweets[0] || 'no tweets'}</pre>
      <List items={this.state.items}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));