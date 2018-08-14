'use strict';
console.log('Loading function');

var scraperjs = require('scraperjs');
var request = require('request');

function fetchColors(url, cb) {
  scraperjs.StaticScraper.create(url)
    .scrape(function($) {
      return $("li.color a").map(function() {
        return $(this).text();
      }).get();
    })
    .then((colors)=> cb(null, colors))
    .catch((err)=> cb(err));
};

function toUrl(number) {
  return 'http://dribbble.com/shots/' + number;
};


module.exports = (number) => {
  var url = toUrl(number);
  // console.log(url);

  // Get the colors
  fetchColors(url, function(err, colors) {
    if(err) { 
      console.log(number + ' error');
      console.log(err); 
      return;
    }

    if (colors.length === 0) {
      console.log(number + '|   404');
      return;
    }

    // Format as object for DB
    var object = {
      "id": number,
      "url": url,
      "colors": colors
    }

    // Format post request
    var options = {
        url: 'https://5ccd5xqage.execute-api.us-west-2.amazonaws.com/prod/colors',
        json: true,
        body: object,
        headers: {
            'Content-type': 'application/json'
        },
    }

    // Post it
    request.post(options, function (err, response, body) {
      if (err) { 
          console.log(number + ' failed to post');
          console.log(err);
          return;
      }

      var statusCode = response.statusCode.toString();

      console.log(number + '|' + statusCode);

      if (statusCode === 200) {
        console.log(number + ' success.');
      }

    });
  });
};







