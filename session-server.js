"use strict";

require("dotenv").config();

const { Mysql } = require("./utils");

const serverPort = 3075,
  http = require("http"),
  express = require("express"),
  app = express(),
  server = http.createServer(app),
  WebSocket = require("ws"),
  websocketServer = new WebSocket.Server({ server });

//when a websocket connection is established
websocketServer.on("connection", (webSocketClient) => {
  //send feedback to the incoming connection
  webSocketClient.send('{ "connections" : "ok"}');

  //when a message is received
  webSocketClient.on("message", async (msg) => {
    msg = msg.toString();
    msg = msg.split(" ");
    const match_id = msg[0];
    const src = msg[1];

    setInterval(async () => {
      const query = `SELECT market_status,session_title,src,session_id,session_key_no,session_key_yes,session_rate_yes,session_rate_no from session_bet where match_id='${match_id}' and src='${src}' and result_status='pending' and is_active='1'`;
      const res = await Mysql.query(query);
      webSocketClient.send(JSON.stringify(res));
    }, 2500);
  });

  //handle close connection
  webSocketClient.on("close", () => {
    console.log("The connection has been closed successfully.");
  });
});

//start the web server
server.listen(serverPort, () => {
  console.log(`Websocket server started on port ` + serverPort);
});
