'use strict';

require('babel-polyfill');

var _RoomListScraper = require('./scraper/RoomListScraper');

var _RoomListScraper2 = _interopRequireDefault(_RoomListScraper);

require('./io/mongo');

var _hall = require('./io/models/hall');

var _hall2 = _interopRequireDefault(_hall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schoolId = "STAN9568";
var StanfordScraper = new _RoomListScraper2.default();

//Every hour, refresh the halls on MongoDB
setInterval(function () {
  StanfordScraper.updateRoomsOnDatabase(schoolId);
}, 60 * 60 * 1000);

//Every minute, update all washers
setInterval(updateHalls, 60 * 1000);

function updateHalls() {
  var hallStream;
  return regeneratorRuntime.async(function updateHalls$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          hallStream = _hall2.default.find().stream();


          hallStream.on('data', function _callee(doc) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;
                    _context.next = 3;
                    return regeneratorRuntime.awrap(StanfordScraper.updateMachinesOnDatabase(schoolId, doc.id));

                  case 3:
                    console.log("Updated machines for " + schoolId + " hall " + doc.id + " (" + doc.name + ")");
                    _context.next = 9;
                    break;

                  case 6:
                    _context.prev = 6;
                    _context.t0 = _context['catch'](0);

                    console.log(_context.t0);

                  case 9:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this, [[0, 6]]);
          }).on('error', function (err) {
            console.log(err);
          });

        case 2:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}

updateHalls();