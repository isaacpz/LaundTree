import 'babel-polyfill';
import RoomListScraper from './scraper/RoomListScraper';
import './io/mongo';
import Hall from './io/models/hall';

let schoolId = "STAN9568";
let StanfordScraper = new RoomListScraper();

//Every hour, refresh the halls on MongoDB
setInterval(function() {
  StanfordScraper.updateRoomsOnDatabase(schoolId);
}, 60 * 60 * 1000);

//Every minute, update all washers
setInterval(updateHalls, 60 * 1000);

async function updateHalls() {
  let hallStream = Hall.find().stream();

  hallStream.on('data', async function(doc) {
    try {
      await StanfordScraper.updateMachinesOnDatabase(schoolId, doc.id);
      console.log("Updated machines for " + schoolId + " hall " + doc.id + " (" + doc.name + ")");
    } catch(err) {
      console.log(err);
    }
  }).on('error', function(err) {
    console.log(err);
  });
}

updateHalls();
