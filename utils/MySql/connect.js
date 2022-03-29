const mysql = require("mysql");
var connection = mysql.createConnection({
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
  console.log("connected as id " + connection.threadId);
});

const connect = async (match_id) => {
  const query = `Select * from odd_bet where match_id=${match_id} and src='api'`;
  const res = await performQuery(connection, query);
  return res[0];

  connection.end();
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
