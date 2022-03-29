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

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log("The solution is: ", results[0].match_id);
  });

  // connection.end();
};

module.exports = connect;
