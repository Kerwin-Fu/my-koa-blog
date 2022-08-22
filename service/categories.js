async function getAllCategories(ctx) {
  const coll = ctx.mongoClient.db().collection('categories')
  return coll.find({}).toArray()

}

module.exports = {
  getAllCategories
}