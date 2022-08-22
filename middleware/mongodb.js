const mongoClient = require('../database/mongodb')

module.exports = (options) => {
  return async (ctx,next) => {
    ctx.mongoClient = mongoClient
    await next()
  }
}