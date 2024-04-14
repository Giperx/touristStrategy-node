const router = require('@koa/router')()
const {modelUser} = require('@/models/collection') // 引入数据模型
const {Login, Vercode, Mobileregistration} = require('@/config/vailData') // 引入数据校验
const { verCode, queryCode} = require('@/alicode/index') // 发送短信、查询并校验短信

router.post('/login', async ctx => {
    const { mobile, password } = ctx.request.body
    console.log(mobile);
    console.log(password);
    
    Login(mobile, password)
    Vercode(mobile)
    // await verCode(mobile)
    // const res = await queryCode(mobile, 'id', 'code')184900913117222703^0    4111
    const res = await queryCode(mobile, '184900913117222703^0', '4111')    
    ctx.send('SUCCESS', 200, res)
    // ctx.send('SUCCESS', 200)
})

// 小程序端接口：发送手机验证码
router.get('/vercode', async ctx => {
    const { phoneNumbers } = ctx.query
    // 先校验手机号码格式是否正确
    Vercode(phoneNumbers)
    // console.log(phoneNumbers);
    const res = await verCode(phoneNumbers)
    if (res.body.code == 'OK' && res.body.message == 'OK') {
        ctx.send('SUCCESS', 200, {bizId:res.body.bizId, message:'验证码发送成功！！'})
    } else {
        ctx.send(res.body.message)
    }

})

// 小程序端：通过 手机号+验证码 进行登录
router.post('/mobile-registration', async ctx => {
    const { mobile, code, bizId } = ctx.request.body
    // 先校验数据格式相关
    Mobileregistration(mobile, code, bizId)

})

module.exports = router.routes()