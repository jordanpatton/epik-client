var epikClient = require('../lib/epik-client.js');

epikClient.getSurveyPostResponseForm({surveySlug: 'm-example-com'}, {
  ip: '127.0.0.1',
  body: {
    answers: [],
    screenResolution: '1024x768',
    referrer: 'ref',
    visitorId: 'vid',
    userAgent: 'other'
  }
}, function (error, data) {
  console.log(error, data);
});
