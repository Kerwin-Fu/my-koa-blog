const { getAllCategories } = require('../service/categories.js')

module.exports = {
  async list(ctx) {
    const categories = await getAllCategories(ctx)
    ctx.body = {
      code: 0,
      message: '获取分类成功',
      data: categories
    }
  }
}
