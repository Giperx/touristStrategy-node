// 生成四位数的验证码
function generateCode() {
    var code = ''
    // for (let index = 0; index < 4; index++) {
    //     code += Math.floor(Math.random() * 10)
    // }
    for (var i = 0; i < 4; i++) {
        code += Math.floor(Math.random() * 10)
    }
    return code
}

module.exports = { generateCode }