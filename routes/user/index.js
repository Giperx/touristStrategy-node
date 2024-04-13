const router = require('@koa/router')()
const {modelUser} = require('@/models/collection') // 引入数据模型
const {Login} = require('@/config/vailData') // 引入登录数据校验

router.post('/login', async ctx => {
    const { mobile, password } = ctx.request.body
    console.log(mobile);
    console.log(password);
    
    Login(mobile, password)
    
})

module.exports = router.routes()