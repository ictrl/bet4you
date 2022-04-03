const WebSocket = require("ws");
const url1 = "ws://3.111.105.44:3075"; //session
const count = 1000;
for (let i = 0; i < count; i++) {
  console.log({ i });
  const connection = new WebSocket(url1);

  connection.onopen = () => {
    connection.send("31342464 api");
  };

  connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`);
  };

  connection.onmessage = (e) => {
    console.log(e.data);
  };
}

const url2 = "ws://3.111.105.44:9069"; //odds

for (let i = 0; i < count; i++) {
  console.log({ i });
  const connection = new WebSocket(url2);

  connection.onopen = () => {
    connection.send("31342464");
  };

  connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`);
  };

  connection.onmessage = (e) => {
    console.log(e.data);
  };
}

const url3 = "ws://3.111.105.44:5074"; //scorecard

for (let i = 0; i < count; i++) {
  console.log({ i });
  const connection = new WebSocket(url3);

  connection.onopen = () => {
    connection.send("31342464 manual");
  };

  connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`);
  };

  connection.onmessage = (e) => {
    console.log(e.data);
  };
}
