'use strict';

var _settings = require('../settings');

var _settings2 = _interopRequireDefault(_settings);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log("Connecting to MongoDB");
_mongoose2.default.connect(_settings2.default.mongoUri);