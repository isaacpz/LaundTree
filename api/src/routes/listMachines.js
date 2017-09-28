import Hall from '../io/models/hall';
module.exports = function(router){
  router.get("/list_machines", async function(request, response) {
    let hall = await Hall.findOne({schoolId: request.query.schoolId, name: request.query.hall});
    console.log(hall);
    response.json(hall.machines);
  })
}
