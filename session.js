require("dotenv").config();
const { Mysql } = require("./utils");
const { SESSION } = require("./config");
const { port, frequency } = SESSION;

console.log("@@ ~ port", port);

const WebSocket = require("ws");
const eventMap = new Map();
const intervalMap = new Map();

const wss = new WebSocket.Server({ port });

wss.on("connection", (wsc) => {
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
        const query = `SELECT market_status,session_title,src,session_id,session_key_no,session_key_yes,session_rate_yes,session_rate_no from session_bet where match_id='${match_id}' and src='${src}' and result_status='pending' and is_active='1'`;

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
