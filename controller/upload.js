module.exports = {
  async uploadImage(ctx) {
    const file = ctx.request.files.file

    const location = file.path.replace('static', '')

    ctx.body = {
      code: 0,
      message: '上传成功',
      data: {
        location
      }
    }
  }
}
