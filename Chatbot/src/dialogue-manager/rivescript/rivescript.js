const RiveScript = require('rivescript');
const RedisSessionManager = require("rivescript-redis");
const path = require('path');
const utils = require('../../utils/utils');
const logger = require('heroku-logger');


class DialogueManager {

    /**
     * @desc constructor for the DialogueManager class
     * The RiveScript module is initialised in utf-8 mode to
     * allow for Finnish characters
     */
    async constructor() {
        let self = this;
        self.rs = {};

        // persistent session manager using redis
        self.sessionManager = new RedisSessionManager({
            url: process.env.REDIS_URL || "redis://localhost:6379",  // default
            prefix: "rivescript/"
        });

        // load dialogue manager for all languages
            self.rs = await this.loadDialogueManager('experiment', self.sessionManager)
    }

    /**
     * @desc create and return a Rivescript instance for the given locale
     * @param locale the name of the language
     * @param sessionManager the shared object used to manage user data
     * @return {module:rivescript.RiveScript}
     */
    async loadDialogueManager(locale, sessionManager) {

        let dm = new RiveScript({
            utf8: true,
            sessionManager: sessionManager
        });

        // Load the replies and process them
        let dir = path.join(__dirname, './brain/' + locale +'/');

        try {
            await dm.loadDirectory(dir);
            dm.sortReplies();
            logger.info(locale + " - dialogue manager loaded");
        } catch (err) {
            logger.error(err);
        }

        // subroutines for crowdsourcing experiment
        dm.setSubroutine("select_experiment", utils.rewrite_helper.select_experiment);
        dm.setSubroutine("rewrite_complete", utils.rewrite_helper.rewrite_complete);
        dm.setSubroutine("rewrite_partial", utils.rewrite_helper.rewrite_partial);
        dm.setSubroutine("add_feedback", utils.rewrite_helper.add_feedback);
        dm.setSubroutine("notify_new_user", utils.rewrite_helper.notify_new_user);

        return dm
    }

    /**
     * @desc proxy function that requests a reply through RiveScript
     * @param username the name of the user, used as an identifier to keep track of the status of the conversation
     * @param message the text message to be processed
     * @return {Promise<string>} a Promise of a string containing a reply to the message
     */
    async getReply(username, message) {

        return await this.rs.reply(username, message, this);
    }
}

/**
 * @desc expose a singleton instance of the DialogueManager class
 * if an instance of the class already exists return that instance
 * otherwise calls the constructor
 */
class Singleton {

    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = new DialogueManager();
        }
    }

    getInstance() {
        return Singleton.instance;
    }

}

module.exports = Singleton;
