const Router = require('@koa/router')

const authCtrl = require('../controller/auth.js')
const categoriesCtrl = require('../controller/categories.js')
const uploadCtrl = require('../controller/upload.js')
const articleCtrl = require('../controller/article')
const profileCtrl = require('../controller/profile')
const blogCtrl = require('../controller/blog')
const router = new Router()

router.post('/api/register', authCtrl.register)
router.get('/api/captcha', authCtrl.captcha)
router.post('/api/login', authCtrl.login)

router.get('/api/categories', categoriesCtrl.list)
router.post('/api/user/image/upload', uploadCtrl.uploadImage)

router.post('/api/user/articles', articleCtrl.create)
router.get('/api/user/articles', articleCtrl.list)
router.get('/api/user/articles/:id', articleCtrl.detail)
router.delete('/api/user/articles/:id', articleCtrl.remove)
router.put('/api/user/articles/:id', articleCtrl.update)

router.get('/api/user/profile', profileCtrl.getProfile)
router.put('/api/user/profile/baseinfo', profileCtrl.updateProfileBaseInfo)
router.put('/api/user/profile/password', profileCtrl.updateProfilePassword)
router.put('/api/user/profile/avatar', profileCtrl.updateProfileAvatar) 

router.get('/api/articles', blogCtrl.listArticlesByCategory)
router.get('/api/articles/:id', blogCtrl.getArticleDetail)

module.exports = router
