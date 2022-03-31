"use strict";

require("dotenv").config();

const { MysqlS } = require("./utils/index2");

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
    const action = msg[1];
    console.log({ match_id, action });
    setInterval(async () => {
      const res = await MysqlS.query(match_id, action);
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
