var mailgun = require('mailgun-js')({
  apiKey: 'key-904de148e222e41b401970c4062a7477',
  domain: 'sandbox6a50bb194e3a44ddbee8ef64b2a10a75.mailgun.org'
});

module.exports = function(data) {
  data.from = 'Danks Supermarked Digital Lab <ghost@ds-digital-lab.azurewebsites.net>';
  mailgun.messages().send(data, function(error, body) {
    if (error) {
      return console.error(error);
    }
    console.log(body);
  });
};
