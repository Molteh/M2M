const logger = require("morgan");
require("express-async-errors");

module.exports = (app) => {
    app.use(logger("dev")); // logs all requests received

    /**
     * @desc catch exceptions that were not caught properly in a block
     */
    process.on("uncaughtException", (ex) => {
        console.log("Uncaught exception " + ex);
        process.exit(1);
    });

    /**
     * @desc catch rejections that were not caught properly in a block
     */
    process.on("unhandledRejection", (ex) => {
        console.log("Unhandled rejection: " + ex);
        process.exit(1);
    });
};