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
  webSocketClient.on("message", async (msg) => {
    msg = msg.toString();
    setInterval(async () => {
      const res = await Mysql.query(msg);
      // const { match_id, team_1_odd_khai } = res;
      // webSocketClient.send(JSON.stringify({ match_id, team_1_odd_khai }));
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
