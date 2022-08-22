const config = {
  // mongodb相关
  mongodb: {
    uri: 'mongodb://root:123456@localhost:27017/blog',
    options: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      authSource: 'admin'
    }
  },

  // JWT Token相关配置
  jwt: {
    secret: 'mt-blog-secret'
  }
}


module.exports = config
