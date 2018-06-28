import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import dragula from 'react-dragula';
import './Palette.css';
import Color from './Color';
// import Url from './Url';


class Palette extends Component {

  componentDidMount() {
    var palette = ReactDOM.findDOMNode(this);
    dragula([palette]);
  }

  render() {

  	var colorComponents = [];

  	var palette = this.props.palette;
  	// var url = palette.url;
   	var colors = palette.colors;

  	colors.forEach(c => {
	  	colorComponents.push(<Color color={c}/>);
  	});

	  return (
	    <div id="palette">
	    	{colorComponents}
	    </div>
	  );
  }
}


export default Palette;
