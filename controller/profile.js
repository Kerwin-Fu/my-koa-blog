const {
  getCurrentUserProfile,
  updateProfileBaseInfo,
  updateProfilePassword,
  updateProfileAvatar
} = require('../service/profile')

module.exports = {
  async getProfile(ctx) {
    const result = await getCurrentUserProfile(ctx)

    ctx.body = {
      code: 0,
      message: '获取个人资料成功',
      data: result
    }
  },

  async updateProfileBaseInfo(ctx) {
    ctx.verifyParams({
      nickname: 'string'
    })

    await updateProfileBaseInfo(ctx, ctx.request.body)

    ctx.body = {
      code: 0,
      message: '修改个人资料成功',
      data: true
    }
  },

  async updateProfilePassword(ctx) {
    ctx.verifyParams({
      oldPassword: 'password',
      newPassword: 'password'
    })

    await updateProfilePassword(ctx, ctx.request.body)

    ctx.body = {
      code: 0,
      message: '修改密码成功',
      data: true
    }
  },

  async updateProfileAvatar(ctx) {
    ctx.verifyParams({
      avatar: 'string'
    })

    await updateProfileAvatar(ctx,ctx.request.body)

    ctx.body = {
      code: 0,
      message: '修改头像成功',
      data: true
    }
  }
}
