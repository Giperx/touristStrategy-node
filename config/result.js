// 中间件接口规范，统一返回前端数据格式
const responseHandler = async (ctx, next) => {
    ctx.send = (msg = 'SUCCESS', code = 200, data = null, error = null, extra = null ) => {
        ctx.body = {
            msg, // 表示是否成功
            data, // 返回给前端的数据信息
            error, // 错误信息
            extra // 附加信息
        }
        ctx.status = code
    }
    await next()
}
module.exports = responseHandler