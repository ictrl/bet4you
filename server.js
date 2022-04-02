"use strict";

require("dotenv").config();

const { Mysql } = require("./utils");

const serverPort = 9069,
  http = require("http"),
  express = require("express"),
  app = express(),
  server = http.createServer(app),
  WebSocket = require("ws"),
  websocketServer = new WebSocket.Server({ server });

//when a websocket connection is established
websocketServer.on("connection", (webSocketClient) => {
  //send feedback to the incoming connection
  webSocketClient.send('{ "connection" : "ok"}');

  //when a message is received
  webSocketClient.on("message", async (match_id) => {
    match_id = match_id.toString();
    setInterval(async () => {
      const query = `Select team_1_odd_lagai,src,is_active,is_active_wbt,match_id,team_1_odd_khai,team_2_odd_lagai,team_2_odd_khai,team_3_odd_lagai,team_3_odd_khai,market_status,market_status_team2,market_status_draw,same_bhaw_market_status from odd_bet where match_id=${match_id}`;

      const res = await Mysql.query(query);

      webSocketClient.send(JSON.stringify(res));
    }, 2000);
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
