const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(TOKEN);

// require dialog manager
const _ = require(`../dialogue-manager/${process.env.DIALOG_MANAGER_NAME}/${process.env.DIALOG_MANAGER_NAME}`);
const dm = new _().getInstance();

/**
 * @desc process the received message and sends it back using node-telegram-bot-api module
 * @return response with HTTP 200 status if the message got correctly processed,
 * otherwise pass an error to the next handler
 * @param res an http response
 * @param req an http request
 * @param next the next function to be called
 */
function processMessage(req, res, next) {
    bot.processUpdate(req.body);
    res.sendStatus(200);
}

/**
 * @desc listen for message events and process them with the dialogue manager
 * @param msg the json object containing all the information about the received message
 */
bot.on('message', async (msg) => {
    try {
        // get reply from dialogue manager
        let reply = await dm.getReply("TG:" + msg.from.id, msg.text);

        // send reply back
        await bot.sendMessage(msg.chat.id, reply, {"disable_web_page_preview": true});
    } catch (err) {
        console.log("error: " + err);
    }
});

module.exports.processMessage = processMessage;
