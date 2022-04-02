const WebSocket = require("ws");
const url = "ws://localhost:5074";

for (let i = 0; i < 10000; i++) {
  console.log({ i });
  const connection = new WebSocket(url);

  connection.onopen = () => {
    connection.send("31323015 manual");
  };

  connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`);
  };

  connection.onmessage = (e) => {
    console.log(e.data);
  };
}
