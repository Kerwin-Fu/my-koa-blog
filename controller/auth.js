const { doRegister, generateCaptcha, doLogin } = require('../service/auth')

module.exports = {
  async register(ctx) {
    ctx.verifyParams({
      username: 'string',
      nickname: 'string',
      password: 'password'
    })

    await doRegister(ctx, ctx.request.body)

    ctx.body = {
      code: 0,
      message: '注册成功',
      data: true
    }
  },

  async captcha(ctx) {
    const result = await generateCaptcha(ctx)

    ctx.body = {
      code: 0,
      message: '获取验证码成功',
      data: result
    }
  },

  async login(ctx) {
    ctx.verifyParams({
      username: 'string',
      password: 'password',
      captchaKey: 'string',
      captchaCode: 'string'
    })

    const token = await doLogin(ctx, ctx.request.body)

    ctx.body = {
      code: 0,
      message: '登录成功',
      data: token
    }
  }
}
