var db = require('../db');
var util = require('../lib/utility');

// Write you session database model methods here

module.exports = {
  // params = [hash, req.body.username]
  insertSession: function(params, callback) {
    // Create queryStr
    var queryStr = 'INSERT INTO sessions(hash, user_id, client)\
                    VALUES (?, (select id from users where username = ?), ?)';
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
  },
  getUserIdFromHash: function(params, callback) {
    var queryStr = 'Select u.id from users u WHERE u.hash = ? AND u.client = ?';

    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },
  deleteSession: function(params, callback) {
    var queryStr = 'DELETE FROM sessions WHERE hash = ?';

    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },
  initialize: function(client) {
    var salt = util.createSalt();
    var hash = util.createHash(client, salt);

    var queryString = 'INSERT INTO sessions SET ?';
    return db.queryAsync(queryString, { hash: hash, salt: salt }).return(hash);
  },
  getSession: function(hash) {
    // query for the row that corresponds to the hash
    var queryStr = 'SELECT * FROM sessions WHERE hash = ?';


    return db.queryAsync(queryStr, hash).then(function(results) {
      var session = results[0][0];

      // didn't find
      if (!session || !session.userId) {
        return session;
      }

      var queryStr2 = 'SELECT u.username from users u WHERE id = ?';
      return db.queryAsync(queryStr2, session.user_id).then(function(results) {
        session.user = results[0][0];
        return session;
      });

    });
  },
  destroySession: function(hash) {
    var queryStr = 'DELETE FROM sessions WHERE hash = ?';

    db.queryAsync(queryStr, hash);
  }
};
