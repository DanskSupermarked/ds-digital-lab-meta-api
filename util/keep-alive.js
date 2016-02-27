var request = require('request');

module.exports = function(url) {
  console.log('Started keep-alive for ' + url);
  setInterval(function() {
    request(url);
  }, 60 * 1000)
}
