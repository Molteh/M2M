const mongoose = require('mongoose');

module.exports = {

    /**
     * @desc the validation schema applied on all Dialogue documents
     * uploaded to mongoDB though mongoose
     */
     Dialogue: mongoose.model('Dialogues', new mongoose.Schema({
        length: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            required: true
        },
        annotatedMessages: [{
            sender: String,
            annotations: [{
                act: String,
                slot: String,
                value: String
            }],
            template: String,
            rewrite: String
        }],
        processed: Boolean,
        assigned: Boolean,
        feedback: [{
            question: String,
            answer: String
        }]
    }))
};
