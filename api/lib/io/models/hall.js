'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//[{ id: Integer, type: "washer" | "dryer", status: "available" | "inuse", timeRemaining: Number??? }]
exports.default = mongoose.model('halls', new Schema({
  schoolId: String,
  name: String,
  last_updated: { type: Date, default: new Date() },
  id: Number,
  machines: [{
    number: Number,
    type: {
      type: String,
      enum: ["washer", "dryer"]
    },
    available: Boolean
  }]
}));