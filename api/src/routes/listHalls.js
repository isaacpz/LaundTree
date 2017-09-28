import Hall from '../io/models/hall';
module.exports = function(router){
  router.get("/list_halls", async function(request, response) {
    let halls = await Hall.find({schoolId: request.query.schoolId});
    response.json(halls.map((hall) => {
      return {name: hall.name, id: hall.id};
    }));
  })
}
