// 捕获已知错误中间件
class result extends Error {
    constructor(msg, code, error = null) { // 构造函数
        super()
        this.msg = msg
        this.code = code
        this.error = error
    }
}
module.exports = result