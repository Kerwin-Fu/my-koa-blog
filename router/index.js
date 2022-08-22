const Router = require('@koa/router')

const authCtrl = require('../controller/auth.js')
const categoriesCtrl = require('../controller/categories.js')
const uploadCtrl = require('../controller/upload.js')
const articleCtrl = require('../controller/article')
const router = new Router()

router.post('/api/register', authCtrl.register)
router.get('/api/captcha', authCtrl.captcha)
router.post('/api/login', authCtrl.login)

router.get('/api/categories', categoriesCtrl.list)
router.post('/api/user/image/upload', uploadCtrl.uploadImage)

router.post('/api/user/article', articleCtrl.create)
router.get('/api/user/articles', articleCtrl.list)
router.get('/api/user/articles/:id', articleCtrl.detail)

module.exports = router
