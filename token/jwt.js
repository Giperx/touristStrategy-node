// jsonwebtoken相关
const jwt = require('jsonwebtoken')
const {secretkey, expiresIn} = require('./tokentime').security

// 对uid通过secretkey进行加密生成token
function gentoken(uid, scope = 'admin') {
    return jwt.sign({ uid, scope }, secretkey, { expiresIn })
}

module.exports = { gentoken }