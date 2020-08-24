const VERIFY_TOKEN = process.env.MESSENGER_TOKEN || 'YOUR_MESSENGER_BOT_TOKEN';
const PAGE_ACCESS_TOKEN = process.env.MESSENGER_PAGE_ACCESS_TOKEN || 'YOUR_PAGE_ACCESS_TOKEN';
const request = require('request-promise');

// require dialog manager
const _ = require(`../dialogue-manager/${process.env.DIALOG_MANAGER_NAME}/${process.env.DIALOG_MANAGER_NAME}`);
const dm = new _().getInstance();

/**
 * @desc sends back validation token every time facebook checks that the webhook is live
 * @return response with HTTP code 200 if everything went well, 403 otherwise
 * @param req an http request
 * @param res an http response
 * @param next the next function to be called
 */
function verifyWebhook(req, res, next) {

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
}

/**
 * @desc process the received message and sends it back
 * @return response with HTTP code 200 if everything went well, 403 otherwise
 * @param req an http request
 * @param res an http response
 * @param next the next function to be called
 */
async function processMessage(req, res, next) {

    let messaging_events = req.body.entry[0];
    for (const event of messaging_events.messaging) {
        console.log(event);
        if (event.message && event.message.text) {

            if (event.message.is_echo) break;

            // get reply from dialogue manager
            let reply = await dm.getReply("FB:" + event.sender.id, event.message.text);
            // send reply back
            callSendAPI(event.sender.id, reply);
        }
        if (event.postback && event.postback.title) {

            // get reply from dialogue manager
            let reply = await dm.getReply("FB:" + event.sender.id, event.postback.title);
            // send reply back
            callSendAPI(event.sender.id, reply);
        }
    }
    // Assume all went well.
    res.sendStatus(200);
}

/**
 * @desc send http request to facebook server containing PSID of the user and text of the message
 * @param sender the PSID of the user
 * @param text the content of the message to be sent
 */
async function callSendAPI(sender, text) {
    let messageData = {
        text: text
    };
    try {
        await request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: PAGE_ACCESS_TOKEN
            },
            method: 'POST',
            json: {
                recipient: {
                    id: sender
                },
                message: messageData,
            }
        });
    } catch (e) {
        console.log('Error:', e);
    }
}

module.exports.verifyWebhook = verifyWebhook;
module.exports.processMessage = processMessage;
