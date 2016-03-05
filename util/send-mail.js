var mailgun = require('mailgun-js');

var mailServer;

if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
  mailServer = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });
}

module.exports = function(data) {
  data.from = 'Danks Supermarked Digital Lab <ghost@ds-digital-lab.azurewebsites.net>';

  if (!mailServer) {
    return console.log('Sending mail', data);
  }

  mailServer.messages().send(data, function(error, body) {
    if (error) {
      return console.error(error);
    }
    console.log(body);
  });
};
