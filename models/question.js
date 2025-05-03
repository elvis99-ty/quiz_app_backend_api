const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText : {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required:true,
        validate: [array => array.length === 4, 'Must have exactly 4 options'],
    },
    correctAnswerIndex: {
        type: Number,
        required: true,
        min: 0,
        max: 3,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;