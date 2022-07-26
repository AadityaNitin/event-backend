const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestSchema = new mongoose.Schema({
    userId: {type: Schema.Types.ObjectId, ref:"User"},
    eventId: {type: Schema.Types.ObjectId, ref:"Events"},
name: {
    type: String,
    required: true,
  },
  email:{type:String, required:true},
  contact:{type:String},
  questionnaireStatus:{type:Boolean, required:true, default: false},
  consentStatus:{type:Boolean, required:true, default: false},
  questionnaire: Object,
  questionnaireFilledStatus:{type:Boolean, required:true, default: false},
  consentFilledStatus:{type:Boolean, required:true, default: false},
  consent:{type:Object},
 sampleSubmittedStatus:{type:Boolean, required:true, default: false},
 covidStatus:{type:String, default: "pending"},
 testType:{type:String, default: "notset"},



});


module.exports = mongoose.model('Quests', QuestSchema);
