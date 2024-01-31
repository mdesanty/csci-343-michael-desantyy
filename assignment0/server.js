const http = require("http");

const server = http.createServer(requestHandler);
server.listen(3000, "localhost", startHandler);


function requestHandler(req, res) {
  console.log("Handling request.");

  res.writeHead(200, { "Content-Type": "text/html"});
  res.write("<h3>Hello.</h3>");
  res.end("<p>Have a nice day!!</p>");
}

function startHandler() {
  const address = server.address();
  console.log(`Server listening at ${address.address}:${address.port}`);
}