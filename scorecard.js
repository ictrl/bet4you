require("dotenv").config();
const { Mysql } = require("./utils");
const WebSocket = require("ws");
const port = 5074;
let interval_count = 0;

const wss = new WebSocket.Server({ port });

wss.on("connection", (wsc) => {
  const id = uuidv4();
  wsc.id = id;
  wsc.send(`{ "connection id" : "${id}}"`);
  console.log("new connection :", id);

  wsc.on("message", (msg) => {
    msg = msg.toString();
    msg = msg.split(" ");
    const match_id = msg[0];
    const src = msg[1];

    const intervalObj = setInterval(async () => {
      const query = `SELECT scorecard.*,odd_bet.market_status as market_status_team1,odd_bet.market_status_team2,odd_bet.market_status_draw,odd_bet.same_bhaw_market_status FROM scorecard INNER JOIN odd_bet ON scorecard.match_id=odd_bet.match_id WHERE scorecard.match_id=${match_id} and scorecard.score_src='${src}' and odd_bet.result='pending' and odd_bet.src='manual'`;
      const res = await Mysql.query(query);
      wsc.send(JSON.stringify(res));
    }, 2500);

    // const intervalId = intervalObj[Symbol.toPrimitive]();
    interval_count = interval_count + 1;
    wsc.on("close", () => {
      console.log(wsc.id, "closed");
    });
  });
});

const intervalObj = setInterval(() => {
  console.log("------------------------------------");
  let client_count = 0;
  wss.clients.forEach(function each(wsc) {
    client_count = client_count + 1;
  });
  console.log("@@ ~ client_count", client_count);
  console.log("@@ ~ interval_count", interval_count);
}, 1000);
const intervalId = intervalObj[Symbol.toPrimitive]();
console.log("@@ ~ insight", intervalId);

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
console.log("odds script started on port", port);
