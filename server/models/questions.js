const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionsSchema = new mongoose.Schema({
  question: [{question:{
    type: String,
    required: true,
    minlength: 8,
  },
  options:{type:Array}}]
});


module.exports = mongoose.model('Questions', QuestionsSchema);
