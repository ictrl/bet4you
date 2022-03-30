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

const connect = async (match_id,src) => {
  const query = `SELECT scorecard.*,odd_bet.market_status as market_status_team1,odd_bet.market_status_team2,odd_bet.market_status_draw,odd_bet.same_bhaw_market_status FROM scorecard INNER JOIN odd_bet ON scorecard.match_id=odd_bet.match_id WHERE scorecard.match_id=${match_id} and scorecard.score_src=${src} and odd_bet.result='pending' and odd_bet.src='manual'`;
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
