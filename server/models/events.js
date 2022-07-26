const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new mongoose.Schema({
    userId: {type: Schema.Types.ObjectId, ref:"User"},
  eventName: {
    type: String,
    required: true,
  },
  venue:{type:String, required:true},
  address:{type:String, required: true},
  date:{type:Date, required: true, default: Date.now},
  attendees:{type:String}, 
  contact:{type:String},
  guests: [{type: Schema.Types.ObjectId, ref:"Quests"}],
  
});


module.exports = mongoose.model('Events', EventSchema);
