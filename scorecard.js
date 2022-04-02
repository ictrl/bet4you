"use strict";

require("dotenv").config();

const { Mysql } = require("./utils");

const serverPort = 5074,
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
    msg = msg.split(" ");
    const match_id = msg[0];
    const src = msg[1];

    setInterval(async () => {
      const query = `SELECT scorecard.*,odd_bet.market_status as market_status_team1,odd_bet.market_status_team2,odd_bet.market_status_draw,odd_bet.same_bhaw_market_status FROM scorecard INNER JOIN odd_bet ON scorecard.match_id=odd_bet.match_id WHERE scorecard.match_id=${match_id} and scorecard.score_src='${src}' and odd_bet.result='pending' and odd_bet.src='manual'`;
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
