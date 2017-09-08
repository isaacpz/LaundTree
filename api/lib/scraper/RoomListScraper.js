'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     This should just store a list of rooms available
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ex url: https://www.laundryalert.com/cgi-bin/STAN9568/LMPage?CallingPage=LMRoom&RoomPersistence=&MachinePersistenceA=041&MachinePersistenceB=018
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _hall = require('../io/models/hall');

var _hall2 = _interopRequireDefault(_hall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RoomListScraper = function () {
  function RoomListScraper() {
    _classCallCheck(this, RoomListScraper);
  }

  _createClass(RoomListScraper, [{
    key: 'updateRoomsOnDatabase',
    value: function updateRoomsOnDatabase(schoolId) {
      var rooms;
      return regeneratorRuntime.async(function updateRoomsOnDatabase$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log("Updating room list for " + schoolId + " on MongoDB");
              _context.next = 3;
              return regeneratorRuntime.awrap(this.getRoomsFromServer(schoolId));

            case 3:
              rooms = _context.sent;

              rooms.forEach(function (room) {
                room.schoolId = schoolId;
                _hall2.default.update({ schoolId: schoolId, name: room.name }, { $setOnInsert: room }, { upsert: true }, function (err, numUpdated) {});
              });

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'getRoomsFromServer',
    value: function getRoomsFromServer(schoolId) {
      var html, $, table, trs, halls;
      return regeneratorRuntime.async(function getRoomsFromServer$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap((0, _requestPromise2.default)("https://www.laundryalert.com/cgi-bin/" + schoolId + "/LMPage"));

            case 3:
              html = _context2.sent;
              $ = _cheerio2.default.load(html);
              table = $("table[id='tableb']");
              trs = table.children("tbody").children("tr");
              halls = [];

              trs.each(function (i) {
                if (i == 0 || i == trs.length - 1) {
                  return;
                }
                var tr = trs[i];
                var tds = tr.children;
                halls.push({ id: i - 1, name: tds[3].children[1].children[0].children[1].children[0].data.trim() });
              });
              return _context2.abrupt('return', halls);

            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2['catch'](0);

              console.log(_context2.t0);

            case 15:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this, [[0, 12]]);
    }
  }, {
    key: 'updateMachinesOnDatabase',
    value: function updateMachinesOnDatabase(schoolId, hallId) {
      var machines, hall;
      return regeneratorRuntime.async(function updateMachinesOnDatabase$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              console.log("Updating machine list for " + schoolId + " hall " + hallId + " on MongoDB");
              _context3.next = 3;
              return regeneratorRuntime.awrap(this.getMachinesFromServer(schoolId, hallId));

            case 3:
              machines = _context3.sent;
              _context3.next = 6;
              return regeneratorRuntime.awrap(_hall2.default.findOne({ id: hallId }));

            case 6:
              hall = _context3.sent;

              hall.machines = machines;
              _context3.next = 10;
              return regeneratorRuntime.awrap(hall.save());

            case 10:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'getMachinesFromServer',
    value: function getMachinesFromServer(schoolId, hallId) {
      var html, $, table, trs, machines, i, tr, children, machineNumber, type, availability;
      return regeneratorRuntime.async(function getMachinesFromServer$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return regeneratorRuntime.awrap((0, _requestPromise2.default)("https://www.laundryalert.com/cgi-bin/" + schoolId + "/LMRoom?Halls=" + hallId));

            case 3:
              html = _context4.sent;
              $ = _cheerio2.default.load(html);
              table = $("table")[4];
              trs = table.children[1].children;
              machines = [];

              for (i = 2; i < trs.length - 4; i++) {
                tr = trs[i];

                if (tr.name == "tr") {
                  children = tr.children;
                  machineNumber = children[5].children[1].children[0].children[0].children[0].data.trim();
                  type = children[7].children[1].children[0].children[0].data.trim();
                  availability = children[9].children[1].children[0].children[0].data.trim();


                  machines.push({
                    number: parseInt(machineNumber),
                    type: type.toLowerCase().indexOf("washer") >= 0 ? "washer" : "dryer",
                    available: availability == "Available"
                  });
                }
              }

              return _context4.abrupt('return', machines);

            case 12:
              _context4.prev = 12;
              _context4.t0 = _context4['catch'](0);

              console.log(_context4.t0);

            case 15:
            case 'end':
              return _context4.stop();
          }
        }
      }, null, this, [[0, 12]]);
    }
  }]);

  return RoomListScraper;
}();

exports.default = RoomListScraper;