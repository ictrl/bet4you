require("dotenv").config();
const { Mysql } = require("./utils");
const { ODDS, HOSTS } = require("./config");
const { port, frequency } = ODDS;

const WebSocket = require("ws");
const eventMap = new Map();
const intervalMap = new Map();

const wss = new WebSocket.Server({ port });

wss.on("connection", (wsc, req) => {
  let host = req.headers.host;
  host = host.split(":")[0];
  const isHost = HOSTS.findIndex((e) => e === host);
  if (!isHost) {
    //unknow host
    wsc.terminate();
  } else {
    //known host
    console.log("ELSE");
    const id = uuidv4();
    wsc.id = id;
    wsc.send(`{ "connection id" : "${id}}"`);
    console.log("new connection :", id);

    wsc.on("message", (event) => {
      event = event.toString();
      let split = event.split(" ");
      const match_id = split[0];
      const src = split[1];
      wsc.event = event; //adding event to remove from MAP after client conn. close

      //manage match_id and scr with interval id
      const isEvent = eventMap.get(event);
      console.log("@@ ~ isEvent", event);
      if (isEvent) {
        //interval is already exist
        //map client to get data
        eventMap.set(event, [...isEvent, wsc]);
      } else {
        //start a new interval
        eventMap.set(event, [wsc]);
        const intervalObj = setInterval(async () => {
          const query = `Select team_1_odd_lagai,src,is_active,is_active_wbt,match_id,team_1_odd_khai,team_2_odd_lagai,team_2_odd_khai,team_3_odd_lagai,team_3_odd_khai,market_status,market_status_team2,market_status_draw,same_bhaw_market_status from odd_bet where match_id=${match_id}`;

          const res = await Mysql.query(query);
          const clients = eventMap.get(event);
          console.log("@@ ~ clients", clients.length);
          for (let i = 0; i < clients.length; i++) {
            const client = clients[i];
            console.log("@@ ~ client", event, client.id);
            client.send(JSON.stringify(res));
          }
        }, frequency);

        const intervalId = intervalObj[Symbol.toPrimitive]();
        intervalMap.set(event, intervalId); //one to one relation between Interval and Event
      }
      wsc.on("close", () => {
        console.log(wsc.id, wsc.event, "closed");
        const clients = eventMap.get(wsc.event);
        const new_active_clients = clients.filter(
          (client) => client.id != wsc.id
        );
        if (new_active_clients.length > 0) {
          //update the active clients to eventMap
          eventMap.set(wsc.event, new_active_clients);
        } else {
          //remove event from eventMap
          eventMap.delete(wsc.event);
          const intervalId = intervalMap.get(wsc.event);
          clearInterval(intervalId);
          intervalMap.delete(wsc.event);
        }
      });
    });
  }
});

const intervalObj = setInterval(() => {
  console.log("------------------------------------");
  let client_count = 0;
  wss.clients.forEach(function each(wsc) {
    client_count = client_count + 1;
  });
  console.log("@@ ~ client_count", client_count);
  console.log("@@ ~ event_count", intervalMap.size);
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
console.log("scorecards script started on port", port);
