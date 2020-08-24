const _ = require('lodash');
const {Dialogue} = require('../models/dialogue');
const {Diialogue} = require('./../../../models/dialogue_fi');

const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(TOKEN);

var totalUsers = 0;

const DIALOGUES = {
    EXPLANATION_COMPLETE: {
        en: 'Hi! You will be shown a very unnatural computer generated conversation between a user and this chatbot.\n' +
            'Your task is to rewrite some messages with your own words while keeping the exact same meaning. The messages you rewrite must sound like a real conversation between a user and a professional assistant. Here follows an example:\n' +
            '\n' +
            'User: “greetings and register to Siirtosoitto”, Your rewrite: “Hi! I would like to register to this service”\n' +
            'Chatbot: “affirm and provide reference for: phone number and areas of interest,” Your rewrite: “Sure! Tell me your phone number and for which areas you want to get notified.”\n' +
            'User: “notification area is Kaikukatz and Phone number is 044654930”, Your rewrite: "it is 044654930 and I am interested in Kaikukatz”\n' +
            'Chatbot: “ask confirmation for the following: Area is Kaikukatu”, Your rewrite: “Is the area Kaikukatu?”\n' +
            'Etc...\n' +
            '\n' +
            'Be creative with your rewritten messages as long as all they keep the same meaning as the original ones.\n' +
            'The messages that you will rewrite will be tagged as “User” or “Chatbot” to help you remember whether you have to assume the point of view of the User or of the SiirtoSoitto system\n' +
            '\n' +
            'A new message will appear automatically after you rewrite with your own words and send the previous. If you are unsure check the example above. We will tell you when the task is completed.\n' +
            'Write "start" to begin the experiment and make the first message appear\n\n'
        ,

        old: 'You will be shown a very unnatural computer generated conversation between a user and this chatbot.\n' +
                'Your task is to paraphrase each message in order to create a new conversation that has the exact same meaning but sounds like ' +
            'a real conversation between a user and a professional assistant. Here follows an example:\n\n' +
            'User: greetings and register to Siirtosoitto, Rewrite: Hi! I would like to register to this service\n' +
            'Chatbot: affirm and provide reference for: phone number and areas of interest: Rewrite: Sure! Tell me your phone number and for which areas you want to get notified\n' +
            'User: notification area is Kaikukatz and Phone number is 044654930, Rewrite: "it is 044654930 and I am interested in Kaikukatz\n' +
            'Chatbot: ask confirmation for the following: Area is Kaikukatu, Rewrite: Is the area Kaikukatu?\n' +
            'Etc...\n\n' +
            'Be creative with your paraphrased messages as long as you meet the following criteria:\n\n' +
            '- User messages need to look like something you would write when chatting with a person\n' +
            '- Chatbot messages need to look formal\n' +
            '- All of your paraphrased messages must keep the same meaning as the original one\n' +
            '\nThe messages will appear automatically after your send each rewrite. Here is the first:\n\n',

        fi: 'Käyttäjän ja tämän chatbotin välillä näytetään hyvin luonnoton tietokoneella luotu keskustelu.\n' +
            'Sinun tehtäväsi on parafroida jokainen viesti uuden keskustelun luomiseksi, jolla on täsmälleen sama merkitys, ' +
            'mutta kuulostaa todelliselta keskustelulta käyttäjän ja ammatillisen avustajan välillä. Tässä seuraa esimerkki:\n\n' +
            'User: tervehdys ja ilmoittautuminen Siirtosoittoon, kirjoita: Hei! Haluaisin ilmoittautua tähän palveluun\n' +
            'Chatbot: vahvista ja anna viite: puhelinnumero ja kiinnostavat alueet: Kirjoita uudelleen: Toki! Kerro puhelinnumerosi ja mistä alueista haluat saada ilmoituksen\n' +
            'User: ilmoitusalue on Kaikukatz ja puhelinnumero on 044654930, Kirjoita: "se on 044654930 ja olen kiinnostunut Kaikukatzista\n' +
            'Chatbot: kysy vahvistus seuraavalle: Alue on Kaikukatu, Kirjoita uudelleen: Onko alue Kaikukatu?\n' +
            'Jne...\n\n' +
            'Ole luova muokkaamiesi viestien kanssa niin kauan kuin täytät seuraavat ehdot:\n\n' +
            '- Käyttäjäviestien on näyttävä siltä, ​​että kirjoittaisit jutteleessasi henkilön kanssa\n' +
            '- Chatbot-viestien on oltava muodollisia\n' +
            '- Kaikilla parafraasioiduilla viesteillä on oltava sama merkitys kuin alkuperäisellä\n' +
            '\nSanomat ilmestyvät automaattisesti, kun lähetät jokaisen uudelleenkirjoituksen. Tässä on ensimmäinen:\n\n'
    },

    EXPLANATION_PARTIAL: {
        en: 'Hi! You will be shown a very unnatural computer generated conversation between a user and this chatbot.\n' +
            'Your task is to rewrite some messages with your own words while keeping the exact same meaning. The messages you rewrite must sound like a real conversation between a user and a professional assistant. Here follows an example:\n' +
            '\n' +
            'User: “greetings and register to Siirtosoitto”, Your rewrite: “Hi! I would like to register to this service”\n' +
            'Chatbot: “affirm and provide reference for: phone number and areas of interest,” Your rewrite: “Sure! Tell me your phone number and for which areas you want to get notified.”\n' +
            'User: “notification area is Kaikukatz and Phone number is 044654930”, Your rewrite: "it is 044654930 and I am interested in Kaikukatz”\n' +
            'Chatbot: “ask confirmation for the following: Area is Kaikukatu”, Your rewrite: “Is the area Kaikukatu?”\n' +
            'Etc...\n' +
            '\n' +
            'Be creative with your paraphrased messages as long as all of your rewritten messages keep the same meaning as the original one.\n' +
            'The messages that you will rewrite will be tagged as “User” or “Chatbot” to help you remember whether you have to assume the point of view of the User or of the SiirtoSoitto system\n' +
            '\n' +
            'A new message will appear automatically after you rewrite with your own words and send it. If you are unsure check the example above. We will tell you when the task is completed. Here is the first message:\n\n'
        ,

        old: 'You will be shown small parts of a very unnatural computer generated conversation between a user and this chatbot.\n' +
                'Your task is to paraphrase some messages in order to create a new conversation that has the exact same meaning but sounds like ' +
            'a real conversation between a user and a professional assistant. Here follows an example:\n\n' +
            'User: greetings and register to Siirtosoitto, Rewrite: Hi! I would like to register to this service\n' +
            'Chatbot: affirm and provide reference for: phone number and areas of interest: Rewrite: Sure! Tell me your phone number and for which areas you want to get notified\n' +
            'User: notification area is Kaikukatz and Phone number is 044654930, Rewrite: "it is 044654930 and I am interested in Kaikukatz\n' +
            'Chatbot: ask confirmation for the following: Area is Kaikukatu, Rewrite: Is the area Kaikukatu?\n' +
            'Etc...\n\n' +
            'Be creative with your paraphrased messages as long as you meet the following criteria:\n\n' +
            '- User messages need to look like something you would write when chatting with a person\n' +
            '- Chatbot messages need to look formal\n' +
            '- All of your paraphrased messages must keep the same meaning as the original one\n' +
            '\nThe messages will appear automatically after your send each rewrite. Here is the first:\n\n',

        fi: 'Käyttäjän ja tämän chatbotin välillä näytetään pieniä osia erittäin luontaisesta tietokoneella luodusta keskustelusta.\n' +
            'Sinun tehtäväsi on parafroida joitain viestejä luodaksesi uuden keskustelun, jolla on täsmälleen sama merkitys, ' +
            'mutta kuulostaa todelliselta keskustelulta käyttäjän ja ammatillisen avustajan välillä. Tässä seuraa esimerkki:\n\n' +
            'User: tervehdys ja ilmoittautuminen Siirtosoittoon, kirjoita: Hei! Haluaisin ilmoittautua tähän palveluun\n' +
            'Chatbot: vahvista ja anna viite: puhelinnumero ja kiinnostavat alueet: Kirjoita uudelleen: Toki! Kerro puhelinnumerosi ja mistä alueista haluat saada ilmoituksen\n' +
            'User: ilmoitusalue on Kaikukatz ja puhelinnumero on 044654930, Kirjoita: "se on 044654930 ja olen kiinnostunut Kaikukatzista\n' +
            'Chatbot: kysy vahvistus seuraavalle: Alue on Kaikukatu, Kirjoita uudelleen: Onko alue Kaikukatu?\n' +
            'Jne...\n\n' +
            'Ole luova muokkaamiesi viestien kanssa niin kauan kuin täytät seuraavat ehdot:\n\n' +
            '- Käyttäjäviestien on näyttävä siltä, ​​että kirjoittaisit jutteleessasi henkilön kanssa\n' +
            '- Chatbot-viestien on oltava muodollisia\n' +
            '- Kaikilla parafraasioiduilla viesteillä on oltava sama merkitys kuin alkuperäisellä\n' +
            '\nSanomat ilmestyvät automaattisesti, kun lähetät jokaisen uudelleenkirjoituksen. Tässä on ensimmäinen:\n\n'
    },

    TASK_FINISHED: {
        en: 'Task finished! Thanks for your help! {topic=evaluation_1} {@ start}',
        fi: 'Tehtävä valmis! Kiitos avusta! {topic=evaluation_1_fi} {@ start}'
    },

    TASK_FINISHED_PARTIAL: {
        en: 'Task finished! Thanks for your help! Now that you are done, please read your paraphrased messages from top to bottom.\n' +
            'Does it seem like a piece of conversation between a user that sounds like you and a chatbot that sounds formal? {topic=evaluation_1}',
        fi: 'Tehtävä valmis! Kiitos avusta! Nyt kun olet valmis, lue muokkaamasi viestit ylhäältä alas.\n' +
            'Näyttääkö siltä, että keskustelu on käyttäjän, joka kuulostaa sinulta, ja chatbotin välillä, joka kuulostaa muodolliselta? {topic=evaluation_1_fi}'
    },

    TASK_FINISHED_COMPLETE: {
        en: 'Task finished! Thanks for your help! Now that you are done, please read your paraphrased conversation from top to bottom.\n' +
            'Does it seem like a conversation between a user that sounds like you and a chatbot that sounds formal? {topic=evaluation_1}',
        fi: 'Tehtävä valmis! Kiitos avusta! Nyt kun olet valmis, lue muistilauseistettu keskustelu ylhäältä alas.\n' +
            'Näyttääkö siltä, että käyttäjän, joka kuulostaa sinulta, ja chatbotin väliseltä keskustelulta, joka kuulostaa muodolliselta? {topic=evaluation_1_fi}'
    },

    SOMETHING_WENT_WRONG: {
        en: 'Something bad happened{topic=random}',
        fi: 'Jotain huonoa tapahtui{topic=random}'
    },

    NO_MORE_DATA: {
        en: 'There is no more data to be processed, thanks anyway for your help!{topic=random}',
        fi: 'Käsiteltäviä tietoja ei enää ole, kiitos joka tapauksessa avustasi!{topic=random}'
    }
};

const EXPLANATION_COMPLETE = 'You will be shown a very unnatural computer generated conversation between a user and this chatbot.\n' +
    'Your task is to paraphrase each message in order to create a new conversation that has the exact same meaning but sounds like ' +
    'a real conversation between a user and a professional assistant. Here follows an example:\n\n' +
    'User: greetings and register to Siirtosoitto, Rewrite: Hi! I would like to register to this service\n' +
    'Chatbot: affirm and provide reference for: phone number and areas of interest: Rewrite: Sure! Tell me your phone number and for which areas you want to get notified\n' +
    'User: notification area is Kaikukatz and Phone number is 044654930, Rewrite: "it is 044654930 and I am interested in Kaikukatz\n' +
    'Chatbot: ask confirmation for the following: Area is Kaikukatu, Rewrite: Is the area Kaikukatu?\n' +
    'Etc...\n\n' +
    'Be creative with your paraphrased messages as long as you meet the following criteria:\n\n' +
    '- User messages need to look like something you would write when chatting with a person\n' +
    '- Chatbot messages need to look formal\n' +
    '- All of your paraphrased messages must keep the same meaning as the original one\n' +
    '\nThe messages will appear automatically after your send each rewrite. Here is the first:\n\n';

const EXPLANATION_PARTIAL = 'You will be shown small parts of a very unnatural computer generated conversation between a user and this chatbot.\n' +
    'Your task is to paraphrase some messages in order to create a new conversation that has the exact same meaning but sounds like ' +
    'a real conversation between a user and a professional assistant. Here follows an example:\n\n' +
    'User: greetings and register to Siirtosoitto, Rewrite: Hi! I would like to register to this service\n' +
    'Chatbot: affirm and provide reference for: phone number and areas of interest: Rewrite: Sure! Tell me your phone number and for which areas you want to get notified\n' +
    'User: notification area is Kaikukatz and Phone number is 044654930, Rewrite: "it is 044654930 and I am interested in Kaikukatz\n' +
    'Chatbot: ask confirmation for the following: Area is Kaikukatu, Rewrite: Is the area Kaikukatu?\n' +
    'Etc...\n\n' +
    'Be creative with your paraphrased messages as long as you meet the following criteria:\n\n' +
    '- User messages need to look like something you would write when chatting with a person\n' +
    '- Chatbot messages need to look formal\n' +
    '- All of your paraphrased messages must keep the same meaning as the original one\n' +
    '\nThe messages will appear automatically after your send each rewrite. Here is the first:\n\n';

const QUESTIONS = {
    Q2: 'How long do you think the task was?',
    Q3: 'Did you feel frustrated while doing the task',
    Q4: 'Comment'
};





module.exports = {

    select_experiment: async (rs, args) => {

        let UID = rs.currentUser();
        await rs.setUservar(UID, "preferredLanguage", "en");
        let LANG = (await rs.getUservar(UID, "preferredLanguage"));
        let experiment_type = _.sample(['complete', 'complete']);

        try {
            const dialogue = LANG === 'fi' ? await Diialogue.findOne({processed: false, assigned: false}) : await Dialogue.findOne({processed: false, assigned: false});
            if (!dialogue) return DIALOGUES.NO_MORE_DATA[LANG];
            dialogue.assigned = true;
            await dialogue.save();

            let line;
            let sender;
            for (let i =0; i<=dialogue.annotatedMessages.length; i++) {
                if (dialogue.annotatedMessages[i].rewrite === '') {
                    line = dialogue.annotatedMessages[i].template;
                    sender = dialogue.annotatedMessages[i].sender;
                    break;
                }
            }
            await rs.setUservar(UID, "line", line);

            await rs.setUservar(UID, 'experiment_type', experiment_type);
            await rs.setUservar(UID, 'dialogue_id', dialogue._id);
            if (experiment_type === 'partial') await rs.setUservar(UID, 'lines_left', _.sample([3,4]));

            //if (experiment_type === 'partial') return DIALOGUES.EXPLANATION_PARTIAL[LANG] + sender + ': ' + line;
            //return DIALOGUES.EXPLANATION_COMPLETE[LANG] + sender + ': ' + line;
            if (experiment_type === 'partial') return DIALOGUES.EXPLANATION_PARTIAL[LANG];
            return DIALOGUES.EXPLANATION_COMPLETE[LANG];

        } catch (e) {
            console.log(e);
            return DIALOGUES.SOMETHING_WENT_WRONG[LANG]
        }
    },

    rewrite_complete: async (rs, args) => {

        let UID = rs.currentUser();
        let LANG = (await rs.getUservar(UID, "preferredLanguage"));
        let rewrite = args.join(" ");
        let dialogue_id = await rs.getUservar(UID, 'dialogue_id');

        const dialogue = LANG === 'fi' ? await Diialogue.findById(dialogue_id) : await Dialogue.findById(dialogue_id);
        for (let i =0; i<dialogue.annotatedMessages.length; i++) {
            if (dialogue.annotatedMessages[i].rewrite === '') {
                dialogue.annotatedMessages[i].rewrite = rewrite;
                break;
            }
        }
        await dialogue.save();

        for (let i =0; i<dialogue.annotatedMessages.length; i++) {
            if (dialogue.annotatedMessages[i].rewrite === '') {
                return dialogue.annotatedMessages[i].sender + ": " + dialogue.annotatedMessages[i].template;
            }
        }

        dialogue.processed = true;
        await dialogue.save();
        return DIALOGUES.TASK_FINISHED[LANG];

    },

    rewrite_partial: async (rs, args) => {

        let UID = rs.currentUser();
        let LANG = (await rs.getUservar(UID, "preferredLanguage"));
        let rewrite = args.join(" ");
        let dialogue_id = await rs.getUservar(UID, 'dialogue_id');
        let lines_left = await rs.getUservar(UID, 'lines_left');

        const dialogue = LANG === 'fi' ? await Diialogue.findById(dialogue_id) : await Dialogue.findById(dialogue_id);
        for (let i =0; i<dialogue.annotatedMessages.length; i++) {
            if (dialogue.annotatedMessages[i].rewrite === '') {
                dialogue.annotatedMessages[i].rewrite = rewrite;
                break;
            }
        }
        await dialogue.save();

        lines_left--;
        await rs.setUservar(UID, 'lines_left', lines_left);


        for (let i =0; i<dialogue.annotatedMessages.length; i++) {
            if (dialogue.annotatedMessages[i].rewrite === '') {
                if (!lines_left) {
                    dialogue.assigned = false;
                    await dialogue.save();
                    return DIALOGUES.TASK_FINISHED_PARTIAL[LANG];
                }
                return dialogue.annotatedMessages[i].sender + ": " + dialogue.annotatedMessages[i].template;
            }
        }

        dialogue.processed = true;
        await dialogue.save();
        return DIALOGUES.TASK_FINISHED_PARTIAL[LANG]
    },

    add_feedback: async (rs, args) => {
        let data = args;
        let next_question = QUESTIONS[data.pop()];
        let UID = rs.currentUser();
        let LANG = (await rs.getUservar(UID, "preferredLanguage"));
        let question = await rs.getUservar(UID, 'current_question');
        let answer = data.join(" ");
        let dialogue_id = await rs.getUservar(UID, 'dialogue_id');

        const dialogue = LANG === 'fi' ? await Diialogue.findById(dialogue_id) : await Dialogue.findById(dialogue_id);
        dialogue.feedback.push({question: question, answer: answer});
        await dialogue.save();

        await rs.setUservar(UID, 'current_question', next_question);

        return "";
    },

    notify_new_user: async (rs,  args) => {
        let UID = rs.currentUser();
        totalUsers += 1;
        bot.sendMessage('158849580', `New user: ${UID}. Tot users: ${totalUsers}`);

        return "";
    }

};
