import 'babel-polyfill';
import * as firebase from "firebase-admin";
import settings from './settings/settings';
import DataManager from './scraper/DataManager';

//Setup firebase
var serviceAccount = require("./settings/firebase-key.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: settings.firebase_database
});

/*firebase.database().ref('schools').set([{
  name: "Stanford University",
  id: "STAN9568"
}]);*/


try {
  new DataManager();
} catch(err) {
  console.log(err);
}

/*
var express = require('express');
var app = express();
require("./routes/listSchools")(app);
require("./routes/listHalls")(app);
require("./routes/listMachines")(app);

app.listen(3001, function() {
  console.log(`Find the API at: http://localhost:3001`);
});
*/
