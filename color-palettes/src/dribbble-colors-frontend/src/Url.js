import React, { Component } from 'react';
import './Url.css';

class Url extends Component {

  render() {

  		if (this.props.tweet === true) {
			return (
				<a className="twitter-share-button" className="url" target="_blank" href="https://twitter.com/intent/tweet?url=http%3A%2F%2Fjoshcockrell.com%2Fcolor-palettes&text=Check%20out%20this%20site%20I%20use%20to%20find%20dribbble%20color%20palettes%21&hashtags=color%2C%20palette">Share on Twitter</a>
			);
  		} else {
			return (
				<a href={this.props.url} className="url" target="_blank">{this.props.url}</a>
			);
  		}
  }
}


export default Url;
