const { listArticleByCategory, getArticleDetail } = require('../service/blog')

module.exports = {
  async listArticlesByCategory(ctx) {
    const result = await listArticleByCategory(ctx, ctx.query)

    ctx.body = {
      code: 0,
      message: '获取分类下的文章成功',
      data: result
    }
  },

  async getArticleDetail(ctx) {
    const result = await getArticleDetail(ctx, ctx.params.id)

    ctx.body = {
      code: 0,
      message: '获取文章详情成功',
      data: result
    }
  }
}
