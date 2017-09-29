/*
This should just store a list of rooms available

ex url: https://www.laundryalert.com/cgi-bin/STAN9568/LMPage?CallingPage=LMRoom&RoomPersistence=&MachinePersistenceA=041&MachinePersistenceB=018
*/

import cheerio from 'cheerio';
import rp from 'request-promise';
import * as firebase from "firebase-admin";


export default class RoomListScraper {

  async updateRoomsOnDatabase(schoolId) {
    try {
      console.log("Updating room list for " + schoolId + " on Firebase");
      let rooms = await this.getRoomsFromServer(schoolId);
      for (let room of rooms) {
        room.schoolId = schoolId;
      }

      firebase.database().ref('halls/' + schoolId).set(rooms);
    } catch (err) {
      console.log(err);
    }
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
        halls.push({
          id: i - 1,
          name: tds[3].children[1].children[0].children[1].children[0].data.trim()
        });
      });
      return halls;
    } catch (err) {
      console.log(err);
    }
  }

  async updateMachinesOnDatabase(schoolId, hallId) {
    try {
      let machines = await this.getMachinesFromServer(schoolId, hallId);
      console.log("Updating machine list for " + schoolId + " hall " + hallId + " on Firebase. " + machines.length + " machines found.");
      await firebase.database().ref('machines/' + schoolId + '-' + hallId).set(machines);
    } catch (err) {
      console.log(err);
    }
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

          if (machineNumber === "NaN")
            machineNumber = -1;

          machines.push({
            number: parseInt(machineNumber),
            type: type.toLowerCase().indexOf("washer") >= 0
              ? "washer"
              : "dryer",
            available: availability == "Available"
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
