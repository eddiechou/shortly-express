var Sessions = require('../models/session');
var util = require('../lib/utility');

var createSession = function(req, res, next) {
  /* Insert session into db */


  // // create new session
  if (!req.headers.cookie) {
    var cookieHash = util.createCookieHash();
    var params = [cookieHash, req.body.username];
    
    // Set session on request
    req.session = {};
    req.session.hash = cookieHash; // ??
    console.log('req.session: ', req.session);

    // Set session on response
    res.cookies.shortlyid = {};
    res.cookies.shortlyid.value = cookieHash; // ??
    console.log('res.cookies: ', res.cookies);  
    

    // Insert the session into the db
    Sessions.insertSession(params, function(err, data) {

    });

    // Get user_id using the username
    var userParams = [req.body.username];
    Sessions.getUserId(userParams, function(err, userId) {
      req.session.username = req.body.username;
      req.session.user_id = userId;
    });
  } else { // cookie exists

    req.headers.cookie; // find if this exists in database
  }







  next();


  // sets a new cookie on the response when a session is initialized
  // assigns a session object to the request if a session already exists
  // creates a new hash for each new session
  // assigns a username and user_id property to the session object if the session is assigned to a user

  // clears and resets the cookie if there is no session assigned to the cookie

  // removes session from database if used by a different browser
};

module.exports = createSession;
