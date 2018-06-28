import React from 'react';
import ReactDOM from 'react-dom';
import Palette from './Palette';
import Url from './Url';
import $ from 'jquery';
import ReactGA from 'react-ga';
import './index.css';


// var ReactGA = require('react-ga');
ReactGA.initialize('UA-82641294-1');
ReactGA.set({ page: window.location.pathname });
ReactGA.pageview(window.location.pathname);

function getPalettes(callback) {
  console.log('GET random colors called');

  var request = $.ajax({
    url: 'https://5ccd5xqage.execute-api.us-west-2.amazonaws.com/prod/colors/random',
    method: 'get',
    contentType: 'application/json'
  });
  
  request.done(function (data, textStatus, jqXHR) {
    callback(null, data);
  });
  
  request.fail(function (jqXHR, textStatus, errorThrown) {
    console.log('GET frame failed: ' + errorThrown);
    callback(errorThrown);
  });
};

var palettes = [];

function loadPalettes() {
  console.log('loading palettes!');

  getPalettes(function (err, palettesData){
    if (err) {
      console.log(err);
      return;
    }
    palettes = palettesData.Items;
  });
};

loadPalettes();

function displayColor() {

  ReactGA.event({
    category: 'Display Color'
  });

  if (palettes.length > 0) {
    var nextPalette = palettes.pop()
    ReactDOM.render(<Url url={nextPalette.url} tweet={false} />, document.getElementById('url'));
    ReactDOM.render(<Url url={nextPalette.url} tweet={true} />, document.getElementById('url-tweet'));
    ReactDOM.render(<Palette palette={nextPalette} />, document.getElementById('container'));
  }
  if (palettes.length < 2) {
    console.log('loading more palettes!');
    loadPalettes();
  }
}

// Spacebar press
document.body.onkeyup = function(e){

  if(e.keyCode === 32) {
    displayColor();
  }
}

document.addEventListener('touchend', function(e) {
    e.preventDefault();
    displayColor();
}, false);


