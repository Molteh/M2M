const express = require("express");
const router = express.Router();

const whatsapp = require("./wa");
const messenger = require("./fb");
const telegram = require("./tg.js");

router.use("/wa", whatsapp);
router.use("/fb", messenger);
router.use("/tg", telegram);

module.exports = router;
