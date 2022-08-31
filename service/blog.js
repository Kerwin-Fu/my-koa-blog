const { ObjectId } = require('mongodb')

async function listArticleByCategory(ctx, params) {
  const categoryId = params.categoryId
  const pageNo = parseInt(params.pageNo) || 1
  const pageSize = parseInt(params.pageSize) || 10

  const filter = {}

  if (categoryId) {
    filter.categoryId = {
      $eq: ObjectId(categoryId)
    }
  }

  const aritcleColl = ctx.mongoClient.db().collection('articles')
  const total = await aritcleColl.countDocuments(filter)
  const items = await aritcleColl
    .aggregate([
      { $match: filter },
      { $sort: { cteateAt: -1 } },
      { $skip: (pageNo - 1) * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner'
        }
      },
      { $unwind: '$owner' },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categories'
        }
      },
      { $unwind: '$categories' },
      {
        $project: {
          ownerId: 0,
          categoryId: 0,
          owner: {
            username: 0,
            password: 0
          },
          content: 0
        }
      }
    ])
    .toArray()

  return {
    total,
    items
  }
}

async function getArticleDetail(ctx, id) {
  const articleColl = ctx.mongoClient.db().collection('articles')
  const items = await articleColl
    .aggregate([
      // 过滤条件
      { $match: { _id: ObjectId(id) } },
      // 根据用户 Id, 联表查询出用户的详细信息
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner'
        }
      },
      // 上述联表查询出来的结果, 是一个数组包对象的格式
      { $unwind: '$owner' },
      // 根据分类 Id, 联表查询出分类的详细信息
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categories'
        }
      },
      // 上述联表查询出来的结果, 是一个数组包对象的格式
      { $unwind: '$categories' },
      {
        $project: {
          ownerId: 0,
          categoryId: 0,
          owner: {
            username: 0,
            password: 0
          }
        }
      }
    ])
    .toArray()

  return items[0]
}

module.exports = {
  listArticleByCategory,
  getArticleDetail
}
