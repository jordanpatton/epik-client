var epikclient = require('../lib/epikclient.js')();

epikclient.getSurvey({surveySlug: 'm-example-com'}, {}, function (error, data) {
  console.log(error, data);
});
