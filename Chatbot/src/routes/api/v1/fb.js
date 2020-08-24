const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');

const controller = require("../../../controllers/fb-controller");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    res.status(200).send("Facebook messenger endpoint is up and running");
});

router.get("/incoming/", controller.verifyWebhook);

router.post("/incoming/", controller.processMessage);

module.exports = router;