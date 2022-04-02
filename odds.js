require("dotenv").config();
const { Mysql } = require("./utils");
const WebSocket = require("ws");
const port = 9069;

const wss = new WebSocket.Server({ port });

wss.on("connection", (wsc) => {
  const id = uuidv4();
  wsc.id = id;
  wsc.send(`{ "connection id" : "${id}}"`);
  console.log("new connection :", id);

  wsc.on("message", (msg) => {
    const match_id = msg.toString();
    const id = wsc.id;
    console.log("message from :", id);

    setInterval(async () => {
      const query = `Select team_1_odd_lagai,src,is_active,is_active_wbt,match_id,team_1_odd_khai,team_2_odd_lagai,team_2_odd_khai,team_3_odd_lagai,team_3_odd_khai,market_status,market_status_team2,market_status_draw,same_bhaw_market_status from odd_bet where match_id=${match_id}`;

      const res = await Mysql.query(query);

      wsc.send(JSON.stringify(res));
    }, 2000);

    wsc.on("close", () => {
      console.log(wsc.id, "closed");
    });
  });
});

setInterval(() => {
  console.log("------------------------------------");
  let client_count = 0;
  wss.clients.forEach(function each(wsc) {
    // console.log(wsc.id);
    client_count = client_count + 1;
  });
  console.log("@@ ~ client_count", client_count);
}, 1000);

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
console.log("odds script started on port", port);
