import * as firebase from "firebase-admin";
import RoomListScraper from './RoomListScraper';

export default class DataManager {
  constructor() {
    try {
      this.scraper = new RoomListScraper();
      //Every minute, get new machine info
      setInterval(() => {this.updateHalls()}, 60 * 1000);
      //Every hour, refresh the halls on MongoDB
      setInterval(() => {this.updateRooms()}, 60 * 60 * 1000);

      this.updateRooms()
      this.updateHalls()
    } catch (err) {
      console.log(err);
    }
  }

  updateHalls = async () => {
    try {
      let schools = await this.getSchools();
      for (let school of schools) {
        console.log("Updating machines for " + school.name + " (" + school.id + ")");
        let halls = await firebase.database().ref('halls/' + school.id).once('value');
        halls = halls.val();
        for (let doc of halls) {
          try {
            await this.scraper.updateMachinesOnDatabase(school.id, doc.id);
          } catch (err) {
            console.log(err);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  updateRooms = async () => {
    try {
      let schools = await this.getSchools();
      for(let school of schools) {
        this.scraper.updateRoomsOnDatabase(school.id);
      }
    } catch (err) {
      console.log(err);
    }
  }

  getSchools = async () => {
    try {
      let schoolData = await firebase.database().ref('schools').once('value');
      return schoolData.val();
    } catch (err) {
      console.log(err);
    }
  }
}
