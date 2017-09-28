import DataManager from '../scraper/DataManager';

module.exports = function(router){
  router.get("/list_schools", async function(request, response) {
    let schools = await new DataManager().getSchools();
    response.json(schools);
  })
}
