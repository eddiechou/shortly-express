var db = require('../db');
var util = require('../lib/utility');

// Write you session database model methods here

module.exports = {
  // params = [hash, req.body.username]
  insertSession: function(params, callback) {
    // Create queryStr
    var queryStr = 'INSERT INTO sessions(hash, user_id)\
                    VALUES (?, select id from users where username = ?)';
    // Invoke query
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },
  // params = [username]
  getUserId: function(params, callback) {

    var queryStr = 'SELECT u.id from users u WHERE u.name = ?';

    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  }
};
