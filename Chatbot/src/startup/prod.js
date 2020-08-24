const helmet = require("helmet");

module.exports = (app) => {
    app.use(helmet()); // add middleware to increase security from HTTP attacks
};