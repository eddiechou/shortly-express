var db = require('../db');
var utils = require('../lib/utility');

// Write you user database model methods here

module.exports = {
  userPost: function(params, callback) {
    // Create queryStr
    var queryStr = 'INSERT INTO users(username, password, salt)\
                    VALUES (?, ?, ?)';
    // Invoke query
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },
  getLoginInfo: function(params, callback) {
    // send back salt and hashedPassword
    var queryStr = 'SELECT u.salt, u.password from users u WHERE u.username = ?;';
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  }
};
