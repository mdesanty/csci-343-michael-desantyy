require("dotenv").config();

const http = require("http");
const url = require("url");

const server = http.createServer(requestHandler);
server.listen(process.env.PORT, process.env.HOST, startHandler);

function startHandler() {
  const address = server.address();
  console.log(`Server listening at ${address.address}:${address.port}`);
}

function requestHandler(req, res) {
  const urlParts = url.parse(req.url, true);
  const path = urlParts.pathname;
  const method = req.method;

  if(method !== "GET") {
    writeResponse(res, 405, { error: `Method ${method} not allowed.` });
    return;
  }

  switch(path) {
    case "/add":
      handleAdd(req, res);
      break;
    case "/subtract":
      handleSubtract(req, res);
      break;
    case "/sum":
      handleSum(req, res);
      break;
    default:
      writeResponse(res, 404, { error: `Path ${path} not recognized.` });
      break;
  }

}

function handleAdd(req, res) {
  try {
    const query = getQuery(req);

    if (query.a === undefined || query.b === undefined)
      throw Error("Both a and b are required.");

    const a = parseInt(query.a);
    const b = parseInt(query.b);

    if (isNaN(a) || isNaN(b))
      throw Error("Both a and b must be numbers." );

    const sum = a + b;

    writeResponse(res, 200, { result: sum });
  }
  catch(error) {
    writeResponse(res, 400, { error: error.message });
  }

}

function handleSubtract(req, res) {
  const query = getQuery(req);

  if (query.a === undefined || query.b === undefined) {
    writeResponse(res, 400, { error: "Both a and b are required." });
    return;
  }

  const a = parseInt(query.a);
  const b = parseInt(query.b);

  if(isNaN(a) || isNaN(b)) {
    writeResponse(res, 400, { error: "Both a and b must be numbers." });
    return;
  }

  const difference = a - b;

  writeResponse(res, 200, { result: difference });
}

function handleSum(req, res) {
  const query = getQuery(req);

  if(query.num === undefined) {
    writeResponse(res, 400, { error: "Please provide num values" });
    return;
  }

  const nums = (query.num instanceof Array ? query.num : [query.num]);

  let numsValid = true;
  nums.forEach(num => {
    if(isNaN(parseInt(num))) {
      numsValid = false;
    }
  });

  if(!numsValid) {
    writeResponse(res, 400, { error: "All num values must be numbers." });
    return;
  }

  const sum = nums.map(value => parseInt(value))
    .reduce((total, current) => { return total + current }, 0);

  writeResponse(res, 200, { result: sum });
}

function getQuery(req) {
  const urlParts = url.parse(req.url, true);
  const query = urlParts.query;

  return query;
}

function writeResponse(res, status, object) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(object));
}






// const query = urlParts.query;

// res.write("<h2>Parameters:</h2>");
// res.write("<ul>");


// for (const key in query) {
//   res.write(`<li>${key}: ${query[key]}</li>`);
// }

// /**
//  * You could also access specific query string values like this:
//  * query.keyName
//  * or
//  * query[keyName]
//  */

// res.end("</ul>");