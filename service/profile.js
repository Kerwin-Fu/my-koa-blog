const { ObjectId } = require('mongodb')
const { hash, compare } = require('bcrypt')
async function getCurrentUserProfile(ctx) {
  console.log(ctx.state)
  const currentUserId = ObjectId(ctx.state.user.sub)
  const userColl = ctx.mongoClient.db().collection('users')

  const result = await userColl.findOne({
    _id: currentUserId
  })

  return result
}

async function updateProfileBaseInfo(ctx, params) {
  const currentUserId = ObjectId(ctx.state.user.sub)
  const nickname = params.nickname

  const userColl = ctx.mongoClient.db().collection('users')
  await userColl.updateOne(
    {
      _id: currentUserId
    },
    {
      $set: {
        nickname
      }
    }
  )
}

async function updateProfilePassword(ctx, params) {
  const currentUserId = ObjectId(ctx.state.user.sub)
  const oldPassword = params.oldPassword
  const newPassword = params.newPassword

  const userColl = ctx.mongoClient.db().collection('users')
  const user = userColl.findOne({ _id: currentUserId })

  const isValidOldPassword = await campare(oldPassword, user.password)
  if (!isValidOldPassword) {
    return ctx.throw({
      code: 10302,
      message: '输入的旧密码不正确'
    })
  }

  const passwordHash = await hash(newPassword, 10)
  await userColl.updateOne(
    {
      _id: currentUserId
    },
    {
      $set: {
        password: passwordHash
      }
    }
  )
}

async function updateProfileAvatar(ctx, params) {
  const currentUserId = ObjectId(ctx.state.user.sub)
  const avatar = params.avatar

  const userColl = ctx.mongoClient.db().collection('users')
  await userColl.updateOne(
    {
      _id: currentUserId
    },
    {
      $set: {
        avatar
      }
    }
  )
}

module.exports = {
  getCurrentUserProfile,
  updateProfileBaseInfo,
  updateProfilePassword,
  updateProfileAvatar
}
