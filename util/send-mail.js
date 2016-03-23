const mailgun = require('mailgun-js');

var mailServer;

if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
  mailServer = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });
}

module.exports = function sendMail(data) {
  data.from = 'Dansk Supermarked Digital Lab <ghost@ds-digital-lab.azurewebsites.net>';

  if (!mailServer) {
    return console.log('Sending mail', data);
  }

  return mailServer.messages().send(data, (error, body) => {
    if (error) {
      return console.error(error);
    }
    return console.log(body);
  });
};
