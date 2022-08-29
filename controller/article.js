const {
  createArticle,
  listArticles,
  getArticleById,
  removeArticle,
  updateArticle
} = require('../service/article')

module.exports = {
  async create(ctx) {
    ctx.verifyParams({
      categoryId: 'string',
      title: 'string',
      summary: 'string',
      content: 'string'
    })

    await createArticle(ctx, ctx.request.body)

    ctx.body = {
      code: 0,
      message: '文章录入成功',
      data: true
    }
  },

  async list(ctx) {
    const result = await listArticles(ctx, ctx.query)

    ctx.body = {
      code: 0,
      message: '获取文章分页成功',
      data: result
    }
  },

  async detail(ctx) {
    const id = ctx.params.id
    const result = await getArticleById(ctx, id)

    ctx.body = {
      code: 0,
      message: '文章获取成功',
      data: result
    }
  },

  async remove(ctx) {
    const id = ctx.params.id

    await removeArticle(ctx,id)

    ctx.body = {
      code: 0,
      message: '删除文章成功',
      data: true
    }
  },

  async update(ctx) {
    console.log(ctx.params)
    ctx.verifyParams({
      categoryId: 'string',
      title: 'string',
      summary: 'string',
      content: 'string'
    })
    const id = ctx.params.id

    await updateArticle(ctx,id,ctx.request.body)

    ctx.body = {
      code: 0,
      message: '修改文章成功',
      data: true
    }
  }
}
