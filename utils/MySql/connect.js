var mysql = require("mysql");

const connect = async (match_id) => {
  try {
    //connect to mysql db
    const connection = mysql.createConnection({
      host: process.env.host,
      user: process.env.user,
      database: process.env.database,
      password: process.env.password,
    });

    connection.connect(function (err) {
      if (err) {
        console.error("error connecting: " + err.stack);
        return;
      }
    });
    // query = `SELECT * FROM session_bet where result_status='pending' and src='manual' and is_active='1'`;
    query = `Select * from odd_bet where match_id=${match_id} and src='api'`;
    const res = await performQuery(connection, query);
    return res[0] || {};

    connection.end();
  } catch (error) {
    console.error({ error: error.message, table });
  }
};

/* promisified query method, suitable for await */
function performQuery(connection, query) {
  try {
    return new Promise((resolve, reject) => {
      connection.query(query, function (error, result) {
        if (error) {
          // return reject(error);
          resolve(error);
        }
        resolve(result);
      });
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = connect;
