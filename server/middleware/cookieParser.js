var parseCookies = function(req, res, next) {
  console.log('headers: ', req.headers);
  if (req.headers.cookie) {
    var cookieArray = req.headers.cookie.split('; ');

    var cookieArray2 = cookieArray.map(function(cookieString) {
      return cookieString.split('=');
    });
    // console.log('cookieArray2', cookieArray2);
    // For each cookie array
      // Create a key, value pair in req.cookies
    cookieArray2.forEach(function(cookieTuple) {
      req.cookies[cookieTuple[0]] = cookieTuple[1];
    });

  } 
  next();
};

module.exports = parseCookies;