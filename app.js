const Koa = require('koa')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const koaCors = require('@koa/cors')
const koaError = require('koa-json-error')
const koaParameter = require('koa-parameter')
const koaJwt = require('koa-jwt')
const config = require('./config/config.default')

const router = require('./router')
const mongoMiddleware = require('./middleware/mongodb')
const app = new Koa()

koaParameter(app)
app.use(koaCors())
app.use(koaStatic('./static'))
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: './static/uploads',
      keepExtensions: true
    }
  })
)
app.use(
  koaError({
    format: (err, obj) => {
      if (obj.code === 'INVALID_PARAM') {
        return {
          code: 40022,
          message: '存在不合法参数'
        }
      }
      return {
        code: obj.code || 50000,
        message: obj.message || err.message
      }
    }
  })
)
app.use(mongoMiddleware())
app.use(
  koaJwt({
    secret: config.jwt.secret
  }).unless({
    path: [/^\/api\/(?!user)/]
  })
)
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8000, console.log('程序已启动'))
