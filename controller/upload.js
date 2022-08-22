module.exports = {
  async uploadImage(ctx) {
    const file = ctx.request.files.file
    console.log(file)
    const location = file.filepath.replace('static', '')

    ctx.body = {
      code: 0,
      message: '上传成功',
      data: {
        location
      }
    }
  }
}
