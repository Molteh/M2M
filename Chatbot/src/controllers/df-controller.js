const handlers = require('../dialogue-manager/dialogflow/handlers');

/**
 * @desc process the received message and sends it back using Twilio module
 * @return response with HTTP 200 status if the message got correctly processed,
 * otherwise pass an error to the next handler
 * @param res an http response
 * @param req an http request
 * @param next the next function to be called
 */
async function processMessage(req, res, next) {

    try {
        let userID = req.body.session.split('/');
        userID = userID[userID.length - 1];
        let intent = req.body.queryResult.intent.displayName;
        let params = req.body.queryResult.parameters;

        console.log(userID, intent, params);

        let response = await handlers[intent](userID, params);
        res.status(200).send(response);
    } catch (err) {
        console.log("error: " + err);
        return next(error)
    }
}

module.exports.processMessage = processMessage;
