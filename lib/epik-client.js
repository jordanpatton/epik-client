module.exports = (function () {
  
  // Dependencies (Private)
  var request = require('request').defaults({
    followAllRedirects: true,
    maxRedirects: 10,
    timeout: 5000,
    jar: true
  });
  var useragent = require('useragent');
  
  // Exposed Object (Public)
  return {
    
    // GET Survey (JSON)
    getSurvey: function (config, payload, callback) {
      var surveyUrl = 'http://epik.io/s/'+(config.surveySlug || '')+'?json=true';
      var payload = payload || {};
      request({
        uri:     surveyUrl,
        method:  'GET',
        headers: {'Content-Type': 'application/json'},
        json:    payload
      }, callback); //@callback: function (error, response, body) {/*...*/}
    },
    
    // POST Response (JSON)
    postResponse: function (config, payload, callback) {
      var surveyUrl = 'http://epik.io/s/'+(config.surveySlug || '')+'?json=true';
      var payload = payload || {};
      request({
        uri:     surveyUrl,
        method:  'POST',
        headers: {'Content-Type': 'application/json'},
        json:    payload
      }, callback); //@callback: function (error, response, body) {/*...*/}
    },
    
    // Convert Response form (HTML>JSON), POST Response (JSON)
    postResponseForm: function (config, req, callback) {
      var agent = useragent.parse((typeof req.body.userAgent !== 'undefined') ? req.body.userAgent : req.headers['user-agent']);
      var payload = {
        "_csrf":            config._csrf              || "",
        "survey":           config.surveyId           || "",
        "answers":          req.body.answers          || {},
        "created":          Date.now()                || "",
        "ipAddress":        req.ip                    || "",
        "agent":            agent.toString()          || "",
        "operatingSystem":  agent.os.toString()       || "",
        "device":           agent.device.toString()   || "",
        "screenResolution": req.body.screenResolution || "",
        "referrer":         req.body.referrer         || "",
        "visitorId":        req.body.visitorId        || ""
      };
      this.postResponse(config, payload, callback);
    },
    
    // Round Trip: GET Survey (JSON), Convert Response form (HTML) to JSON, POST Response (JSON)
    getSurveyPostResponseForm: function (config, postReq, postCallback) {
      var self         = this;
      var config       = config || {};
      var postReq      = postReq || {};
      var postCallback = postCallback || {};
      // GET Survey JSON
      this.getSurvey(config, {}, function (getError, getResponse, getBody) {
        if(getError) {postCallback(new Error('[epik-client] Failed GET.'));}
        else {
          // Parse GET body
          var getBody   = (typeof getBody !== 'object') ? JSON.parse(getBody) : getBody;
          var getMeta   = (typeof getBody.meta !== 'undefined') ? getBody.meta : {};
          var getSurvey = (typeof getBody.surveys !== 'undefined' && getBody.surveys.length > 0) ? getBody.surveys[0] : {};
          // Merge GET body with config
          config._csrf    = getMeta._csrf || "";
          config.surveyId = getSurvey._id || "";
          // POST Response (HTML form)
          self.postResponseForm(config, postReq, postCallback);
        }
      });
    }
    
  }; //...Exposed Object (Public)
  
})(); //...Module
