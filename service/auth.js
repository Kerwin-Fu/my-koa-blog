const { hash, compare } = require('bcrypt')
const svgCaptcha = require('svg-captcha')
const { Base64 } = require('js-base64')
const jwt = require('jsonwebtoken')
const config = require('../config/config.default')
const { ObjectID } = require('mongodb')
/**
 * 检查用户名是否已存在
 * @param {*} ctx
 * @param {String} username 用户名
 */

async function checkUsernameExist(ctx, username) {
  const coll = ctx.mongoClient.db().collection('users')
  const user = await coll.findOne({ username })
  return !!user
}

/**
 * 注册一个用户
 * @param {*} ctx
 * @param {Object} userInfo 用户信息
 * @returns
 */

async function doRegister(ctx, userInfo) {
  const { username, password, nickname } = userInfo
  const isExist = await checkUsernameExist(ctx, username)
  if (isExist) {
    return ctx.throw({ code: 10001, message: '该用户名已存在' })
  }

  const passwordHash = await hash(password, 10)

  const coll = ctx.mongoClient.db().collection('users')
  const result = await coll.insertOne({
    username,
    nickname,
    password: passwordHash,
    createAt: new Date(),
    updateAt: new Date()
  })

  return !!result.insertedId
}

/**
 * 生成图片验证码
 * @param {*} ctx
 */

async function generateCaptcha(ctx) {
  const captcha = svgCaptcha.create()
  const coll = ctx.mongoClient.db().collection('captcha')
  const result = await coll.insertOne({
    text: captcha.text,
    cteateAt: new Date()
  })

  const base64Svg = Base64.encode(captcha.data)

  return {
    key: result.insertedId,
    svg: `data:image/svg+xml;base64,${base64Svg}`
  }
}

/**
 * 用户登录操作
 * @param {*} ctx
 * @param {Object} userInfo 用户信息
 */

async function doLogin(ctx, loginInfo) {
  const { username, password, captchaKey, captchaCode } = loginInfo

  const captColl = ctx.mongoClient.db().collection('captcha')
  const captcha = await captColl.findOne({_id:ObjectID(captchaKey)})
  if(!captcha) { 
    return ctx.throw({code: 10002, message: '验证码已过期，请重新获取验证码！'})
  }

  await captColl.deleteOne({_id: ObjectID(captchaKey)})

  if(captcha.text.toUpperCase() !== captchaCode.toUpperCase()) {
    return ctx.throw({code: 10003, message: '验证码不正确，请重新获取验证码！'})
  }

  const userColl = ctx.mongoClient.db().collection('users')
  const userInDB = await userColl.findOne({username})
  if (!userInDB) {
    return ctx.throw({code: 10004, message: '用户名不正确！'})
  }

  const isValidPassword = await compare(password,userInDB.password)
  if(!isValidPassword) {
    return ctx.throw({code: 10005, message: '密码错误！'})
  }

  // 生成 JWT Token
  const token = jwt.sign({
    suv: userInDB._id.toString(),
    username
  },config.jwt.secret,{
    expiresIn: '36000s'
  })

  return token

}

module.exports = {
  checkUsernameExist,
  doRegister,
  generateCaptcha,
  doLogin
}
