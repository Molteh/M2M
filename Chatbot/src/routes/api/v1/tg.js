const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();

const controller = require("../../../controllers/tg-controller");

router.use(bodyParser.json()); // parse the updates to JSON

router.get("/", (req, res) => {
    res.status(200).send("Telegram endpoint is up and running");
});

router.post("/incoming", controller.processMessage);

module.exports = router;