// 错误捕获中间件

const result = require('@/config/handle')
const errorHandler = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        console.log('出错！！！');
        console.log(error.message);
        const isres = error instanceof result
        // 已知错误，由调用result类
        if (isres) {
            ctx.body = {
                msg: error.msg,
                error: error.error
            }
            ctx.status = error.code
        } else {
            // 未知错误
            ctx.body = {
                msg: '异常错误，来自服务器',
                error:error.message
            } 
            ctx.status = 500
        }
    }
}

module.exports = errorHandler