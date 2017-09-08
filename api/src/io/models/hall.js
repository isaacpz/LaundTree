var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//[{ id: Integer, type: "washer" | "dryer", status: "available" | "inuse", timeRemaining: Number??? }]
export default mongoose.model('halls', new Schema({
  schoolId: String,
  name: String,
  id: Number,
  machines: [{
    number: Number,
    type: {
      type: String,
      enum: ["washer", "dryer"],
    },
    available: Boolean,
  }]
}));
