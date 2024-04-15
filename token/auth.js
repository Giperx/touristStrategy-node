// 中间件
// 解密前端传回的token
const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const result = require('@/config/handle')
const { secretkey } = require('./tokentime').security

// 权限接口
class Auth {
    get m() {
        return async (ctx, next) => {
            const token = basicAuth(ctx.req)
            if (!token || !token.name) {
                throw new result('未登录,没有访问权限', 401)
            }
            try {
                var authcode = jwt.verify(token.name, secretkey)
            } catch (error) {
                if (error.name == 'TokenExpiredError') {
                    throw new result('登录态过期,请重新登录', 401)
                }
                throw new result('没有访问权限', 401)
            }
            ctx.auth = {
                uid: authcode.uid
            }
            await next()
        }
    }
}

module.exports = {Auth}