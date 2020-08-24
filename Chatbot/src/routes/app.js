const express = require("express");

const app = express();

// improve security with helmet
require("../startup/prod")(app);

// add logging with morgan
require("../startup/logging")(app);

const router = require("./api/v1/index");

// binds express to api version
app.use('/api/v1', router);

module.exports = app;