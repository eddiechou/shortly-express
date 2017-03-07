var Promise = require('bluebird');

module.exports = function(db) {
  if (!db.queryAsync) {
    db = Promise.promisifyAll(db);
  }

  // Create links table
  return db.queryAsync('CREATE TABLE IF NOT EXISTS links (\
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
    url VARCHAR(255),\
    baseUrl VARCHAR(255),\
    code VARCHAR(5),\
    title VARCHAR(255),\
    visits INT NOT NULL DEFAULT 0,\
    timestamp TIMESTAMP\
    );')
  .then(function() {
    // Create clicks table
    return db.queryAsync('CREATE TABLE IF NOT EXISTS clicks (\
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
      linkId INT,\
      timestamp TIMESTAMP\
      );');
  })
  /************************************************************/
  /*          Add additional schema queries here              */
  /************************************************************/
  .then(function() {
    // create users table
    return db.queryAsync('CREATE TABLE IF NOT EXISTS users (\
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
      username VARCHAR(255) NOT NULL UNIQUE,\
      password VARCHAR(64) DEFAULT NULL ,\
      salt VARCHAR(16),\
      timestamp TIMESTAMP\
      );');

  })
  .then(function() {
    // create sessions table
    return db.queryAsync('CREATE TABLE IF NOT EXISTS sessions (\
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
      hash VARCHAR(64) NOT NULL,\
      user_id INT DEFAULT NULL,\
      client VARCHAR(256),\
      timestamp TIMESTAMP\
      );');

  })
  .error(function(err) {
    console.log(err);
  });
};
