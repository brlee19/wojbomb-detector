import React from 'react';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    }
    this.onChange = this.onChange.bind(this);
    this.search = this.search.bind(this);
  }

  onChange(e) {
    this.setState({
      term: e.target.value
    })
  }

  search() {
    console.log('search click registered!');
    this.props.search(this.state.term)
  }

  render() {
    return (
      <div>
      <h4>Add a topic to stream!</h4>
      <pre>{this.state.term}</pre>
      Add an additional topic to stream: <input value={this.state.term} onChange={this.onChange}/>       
      <button onClick={this.search}> ADD </button>
      </div>
    )
  }

}

export default Search;