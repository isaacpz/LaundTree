/*
This should just store a list of rooms available

ex url: https://www.laundryalert.com/cgi-bin/STAN9568/LMPage?CallingPage=LMRoom&RoomPersistence=&MachinePersistenceA=041&MachinePersistenceB=018
*/

import cheerio from 'cheerio';
import rp from 'request-promise';
import Hall from '../io/models/hall';

export default class RoomListScraper {

	async updateRoomsOnDatabase(schoolId) {
		console.log("Updating room list for " + schoolId + " on MongoDB");
		let rooms = await this.getRoomsFromServer(schoolId);
		rooms.forEach(function(room) {
			room.schoolId = schoolId;
			Hall.update({schoolId: schoolId, name: room.name}, {$setOnInsert: room}, {upsert: true}, function(err, numUpdated) {

			});
		});
	}

  async getRoomsFromServer(schoolId) { // once a day
    try {
      let html = await rp("https://www.laundryalert.com/cgi-bin/" + schoolId + "/LMPage");

      let $ = cheerio.load(html);
      let table = $("table[id='tableb']");
      let trs = table.children("tbody").children("tr");
      let halls = [];
      trs.each(i => {
        if (i == 0 || i == trs.length - 1) {
          return;
        }
        let tr = trs[i];
        let tds = tr.children;
        halls.push({id: i - 1, name: tds[3].children[1].children[0].children[1].children[0].data.trim()});
      });
			return halls;
    } catch (err) {
      console.log(err);
    }
  }

	async updateMachinesOnDatabase(schoolId, hallId) {
		console.log("Updating machine list for " + schoolId + " hall " + hallId + " on MongoDB");
		let machines = await this.getMachinesFromServer(schoolId, hallId);
		let hall = await Hall.findOne({id: hallId});
		hall.machines = machines;
		await hall.save();
	}

  async getMachinesFromServer(schoolId, hallId) { // often
    try {
      let html = await rp("https://www.laundryalert.com/cgi-bin/" + schoolId + "/LMRoom?Halls=" + hallId);

      let $ = cheerio.load(html);
      let table = $("table")[4];

      let trs = table.children[1].children;
      let machines = [];
      for (let i = 2; i < trs.length - 4; i++) {
          let tr = trs[i];
          if (tr.name == "tr") {
            let children = tr.children;
            let machineNumber = children[5].children[1].children[0].children[0].children[0].data.trim();
            let type = children[7].children[1].children[0].children[0].data.trim();
            let availability = children[9].children[1].children[0].children[0].data.trim();

            machines.push({
              number: parseInt(machineNumber),
              type: type.toLowerCase().indexOf("washer") >= 0 ? "washer" : "dryer",
              available: availability == "Available",
            });
          }
      }

      return machines;

      // https://www.laundryalert.com/cgi-bin/STAN9568/LMRoom?Halls=${n}
      //return table.children("tr");
    } catch (err) {
      console.log(err);
    }
  }
}
