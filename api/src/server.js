import 'babel-polyfill';
import DataManager from './scraper/DataManager';

try {
  new DataManager();
} catch(err) {
  console.log(err);
}


var express = require('express');
var app = express();
require("./routes/listSchools")(app);
require("./routes/listHalls")(app);
require("./routes/listMachines")(app);

app.listen(3001, function() {
  console.log(`Find the API at: http://localhost:3001`);
});
