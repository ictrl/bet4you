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
  const query = `Select team_1_odd_lagai,src,is_active,is_active_wbt,match_id,team_1_odd_khai,team_2_odd_lagai,team_2_odd_khai,team_3_odd_lagai,team_3_odd_khai,market_status,market_status_team2,market_status_draw,same_bhaw_market_status from odd_bet where match_id=${match_id}`;
  const res = await performQuery(connection, query);
  return res;

  // connection.end();
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
