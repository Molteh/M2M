// config environment variables using dotenv module
const path = require('path');
const p = path.resolve(__dirname, '../../.env');
require('dotenv').config({ path: p });

// connect to db
require("../config/db");

const app = require("../routes/app");
const http = require("http");

const port = normalizePort( process.env.PORT || "2999");
app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

console.log("Listening on port: " + port);

function normalizePort(val) {
    const port = parseInt(val, 10);

    if(isNaN(port)) {
        //named pipe
        return val;
    }

    if(port>=0) {
        //port number
        return port
    }

    return false;
}

function onError(error) {
    if(error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr;
}

module.exports = server;