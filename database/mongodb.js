const { MongoClient} = require('mongodb')
const config = require('../config/config.default')

const client = new MongoClient(config.mongodb.uri,config.mongodb.options)

client.connect()

module.exports = client