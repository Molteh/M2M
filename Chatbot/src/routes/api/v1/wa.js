const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();

const controller = require("../../../controllers/wa-controller");

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
    res.status(200).send("Whatsapp endpoint is up and running");
});

router.post("/incoming", controller.processMessage);

module.exports = router;