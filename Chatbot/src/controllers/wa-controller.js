const twilio = require("twilio");

const {
    SID: accountSid,
    KEY: TwilioAuthToken
} = process.env;

twilio(accountSid, TwilioAuthToken);
const { MessagingResponse } = twilio.twiml;

// require dialog manager
const _ = require(`../dialogue-manager/${process.env.DIALOG_MANAGER_NAME}/${process.env.DIALOG_MANAGER_NAME}`);
const dm = new _().getInstance();

/**
 * @desc process the received message and sends it back using Twilio module
 * @return response with HTTP 200 status if the message got correctly processed,
 * otherwise pass an error to the next handler
 * @param res an http response
 * @param req an http request
 * @param next the next function to be called
 */
async function processMessage(req, res, next) {
    const twiml = new MessagingResponse();
    const msg = req.body.Body;
    const phone = req.body.From;
    const id = req.body.AccountSid;

    try {
        // get reply from dialogue manager (using phone instead of id in ordert to skip phone step in registration)
        let reply = await dm.getReply("WA:" + phone.split(":")[1], msg);

        // set reply message
        twiml.message(reply);

        // send reply message
        res.set("Content-Type", "Text/xml");
        return res.status(200).send(twiml.toString());
    } catch (err) {
        console.log("error: " + err);
        return next(error)
    }
}

module.exports.processMessage = processMessage;
