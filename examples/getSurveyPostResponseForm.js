var epikclient = require('../lib/epikclient.js')();

epikclient.getSurveyPostResponseForm({surveySlug: 'm-example-com'}, {
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
