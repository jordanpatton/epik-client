var epikClient = require('../lib/epik-client.js');

epikClient.getSurvey({surveySlug: 'm-example-com'}, {}, function (error, data) {
  console.log(error, data);
});
