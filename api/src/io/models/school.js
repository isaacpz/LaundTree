var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('schools', new Schema({
  name: String,
  id: String
}));
