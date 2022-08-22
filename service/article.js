const { ObjectId } = require('mongodb')

async function createArticle(ctx, articleInfo) {
  const currentUserId = ObjectId(ctx.state.user.sub)
  const categoryId = ObjectId(articleInfo.categoryId)
  const { title, summary, content } = articleInfo

  // 制作一张封面
  const thumbnail = content.match(/<img\s(.*?)\s?src="(.*?)"/)?.[2]

  const articleColl = ctx.mongodb.db().collection('articles')
  const result = await articleColl.insertOne({
    ownerId: currentUserId,
    categoryId: categoryId,
    title,
    summary,
    content,
    thumbnail,
    createAt: new Date(),
    updateAt: new Date()
  })

  if (result.insertedCount === 0) {
    return ctx.throw({ code: 10201, message: '新增文章失败！' })
  }
}

async function listArticles(ctx, params) {
  const currentUserId = ObjectId(ctx.state.user.sub)
  const categoryId = params.categoryId
  const keyword = params.keyword
  const pageNo = parseInt(params.pageNo) || 1
  const pageSize = parseInt(params.pageSize) || 10

  const filter = {
    ownerId: {
      $eq: currentUserId
    }
  }

  if (keyword) {
    filter.title = {
      $regex: new RegExp(keyword, 'ig')
    }
  }

  if (categoryId) {
    filter.categoryId = {
      $eq: ObjectId(categoryId)
    }
  }

  const articleColl = ctx.mongodbClient.db().collection('articles')
  const total = await articleColl.countDocument(filter)

  const items = await articleColl
    .aggregete([
      { $match: filter },
      { $sort: { createAt: -1 } },
      { $skip: (pageNo - 1) * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $project: {
          content: 0,
          summmary: 0,
          thumbnail: 0,
          ownerId: 0,
          categoryId: 0
        }
      }
    ])
    .toArray()

  return {
    total,
    items
  }
}

async function getArticleById(ctx,id) {
  const articleColl = ctx.mongoClient.db().collection('articles')
  return articleColl.findOne({_id: ObjectId(id)})
}

module.exports = {
  createArticle,
  listArticles,
  getArticleById
}
