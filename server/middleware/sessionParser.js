var Sessions = require('../models/session');
var util = require('../lib/utility');
var parseCookies = require('./cookieParser');

var createSession = function(req, res, next) {
  /* Insert session into db */
  // parseCookies(req, res, function() {});



  console.log('req.headers.cookie: ', req.headers.cookie);
  console.log('check if req.cookies exists: ', req.cookies);
  // client is not sending a cookie with the request -> create new session
  if (Object.keys(req.cookies).length === 0 && req.cookies.constructor === Object) {
    var cookieHash = util.createCookieHash();
    var params = [cookieHash, req.body.username, req.headers['user-agent']];
    
    // Set session on request
    req.session = {};
    req.session.hash = cookieHash; // ??
    console.log('req.session: ', req.session);

    // Set cookie on response
    // 
    res.cookies.shortlyid = {};
    res.cookies.shortlyid.value = cookieHash; // ??
    // console.log('res.cookies: ', res.cookies);  

    // // Set cookie on the response
    res.writeHead(200, {
      'Set-Cookie': 'hash' + cookieHash + '; expires=' + new Date(new Date().getTime() + 86409000).toUTCString()
    });
    

    // // Insert the session into the db
    console.log('HEADERS: ', req.headers['user-agent']);
    Sessions.insertSession(params, function(err, data) {
      if (err) {
      } else {
        console.log('>> Correctly inserted session');

      }
    });

    // // Get user_id using the username to put into request.session object
    // var userParams = [req.body.username];
    // Sessions.getUserId(userParams, function(err, userId) {
    //   // if (err) {

    //   // } else {
    //     req.session.username = req.body.username;
    //     req.session.user_id = userId;
    //   // }
    // });
    next();
  } else { // the client is sending a cookie -> check if valid

    req.headers.cookie; // find if this exists in database
    // var params = [req.headers.??.hash];  // contains the hash
    // key, value === shortlyid, hash
    var hash = req.cookies.shortlyid;
    // console.log(" >>>>>>>>>>> request.cookies", req.cookies);
    var params = [hash, req.headers['user-agent']];

    req.session = {};
    req.session.hash = hash;
    
    Sessions.getUserIdFromHash(params, function(err, userId) {
      // Set session object if it already exists
      // if hash was not found OR there is a client conflict
      if (err) {
        // delete the cookie
        console.log('failing getUserIdFromHash');
        // delete the session, since someone malicious is trying to access it
        Sessions.deleteSession([hash], function(err, result) {

        });

      } else { // hash was found -> valid session/cookie
        // put information into session object in request
        console.log('successfully got userID from hash and user-agent');
        req.session = {};
        req.session.hash = hash;
        
        // serve the page
        next();
      }
    });
    


    next();

  }
  // sets a new cookie on the response when a session is initialized
  // assigns a session object to the request if a session already exists
  // creates a new hash for each new session
  // assigns a username and user_id property to the session object if the session is assigned to a user

  // clears and resets the cookie if there is no session assigned to the cookie

  // removes session from database if used by a different browser
};

module.exports = createSession;
// 