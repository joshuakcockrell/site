import React, { Component } from 'react';
import './Color.css';

function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

class Color extends Component {
  render() {

  	var color = this.props.color;
  	var rgb = hexToRgb(color);
  	var rgbString = rgb.r + ',' + rgb.g + ',' + rgb.b;

    return (
      <div className="color" style={{"backgroundColor": color}}>
        <span className="hex value" contentEditable="true">{color}</span>
        <span className="rgb value" contentEditable="true">{rgbString}</span>
      </div>
    );
  }
}

// <i className="fa fa-unlock" aria-hidden="true"/>

export default Color;
