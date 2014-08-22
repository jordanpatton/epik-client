var request = require('request').defaults({
  followAllRedirects: true,
  maxRedirects: 10,
  timeout: 10000,
  jar: true
});
var useragent = require('useragent');



module.exports = function () {
  return {
    
    // GET Survey (JSON)
    getSurvey: function (config, payload, callback) {
      var surveyUrl = 'http://www.epik.io/s/'+(config.surveySlug || '')+'?json=true';
      var payload = payload || {};
      request({
        uri:     surveyUrl,
        method:  'GET',
        headers: {'Content-Type': 'application/json'},
        json:    payload
      }, function (error, response, body) {
        if(error) {callback(new Error('[epikclient] Failed GET at '+surveyUrl+'.'));}
        else      {callback(null, body);}
      });
    },
    
    // POST Response (JSON)
    postResponse: function (config, payload, callback) {
      var surveyUrl = 'http://www.epik.io/s/'+(config.surveySlug || '')+'?json=true';
      var payload = payload || {};
      request({
        uri:     surveyUrl,
        method:  'POST',
        headers: {'Content-Type': 'application/json'},
        json:    payload
      }, function (error, response, body) {
        if(error) {callback(new Error('[epikclient] Failed POST at '+surveyUrl+'.'));}
        else      {callback(null, body);}
      });
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
      this.getSurvey(config, {}, function (getError, getData) {
        // Parse GET data
        var getData   = (typeof getData !== 'object') ? JSON.parse(getData) : getData;
        var getMeta   = (typeof getData.meta !== 'undefined') ? getData.meta : {};
        var getSurvey = (typeof getData.surveys !== 'undefined' && getData.surveys.length > 0) ? getData.surveys[0] : {};
        // Merge GET data with config
        config._csrf    = getMeta._csrf || "";
        config.surveyId = getSurvey._id || "";
        // POST Response (HTML form)
        self.postResponseForm(config, postReq, postCallback);
      });
    }
    
  };
};
