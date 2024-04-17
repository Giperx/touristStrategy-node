// 处理用户登录相关
const router = require('@koa/router')()
const {modelUser} = require('@/models/collection') // 引入数据模型
const { // 引入数据校验
    Login,
    Vercode,
    Mobileregistration,
    Uploadpassword,
    Modifytheuser
} = require('@/config/valiData') 
const { verCode, queryCode } = require('@/alicode/index') // 发送短信、查询并校验短信
const {gentoken} = require('@/token/jwt')
const { Auth } = require('@/token/auth')
const crypto = require('crypto')
const moment = require('moment')
moment.locale('zh-cn') // 定位国内使用



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
    // 判断传回的验证码与发送的是否相同
    await queryCode(mobile, bizId, code)
    // 判断用户之前是否已经注册过账号
    const res = await modelUser.find({ mobile }, { mobile: false, my_tags: false }).lean() //通过lean（）把mongoose数据转换为普通的js对象
    // console.log(res);
    if (res.length > 0) { // 曾经注册过
        const token = { user_Token: gentoken(res[0].uid) }
        ctx.send('SUCCESS', 200, { ...res[0], ...token })
    } else {
        const nickname = 'momo_' + mobile.slice(-6)
        await modelUser.create({mobile, nickname})
        const userData = await modelUser.find({ mobile }, { mobile: false, my_tags: false }).lean() //通过lean（）把mongoose数据转换为普通的js对象
        const token = { user_Token: gentoken(userData[0].uid) }
        ctx.send('SUCCESS', 200, { ...userData[0], ...token })
    }
})

// 小程序端：
// 权限接口
router.get('/projectUser', new Auth().m, async ctx => {
    console.log('11111');
    console.log(ctx.auth.uid);
})

// 小程序端：设置密码修改密码
router.post('/upload-password', async ctx => {
    const { mobile, code, bizId, password } = ctx.request.body
    // 检验数据格式是否正确
    Uploadpassword(mobile, code, bizId, password)
    // 判断传回的验证码与发送的是否相同
    // await queryCode(mobile, bizId, code)
    // 先判断手机号是否已经注册过
    const res = await modelUser.find({ mobile })
    if (res.length > 0) {
        // 创建hash对象
        const hash = crypto.createHash('sha256').update(password)
        // 生成哈希值
        const passwordHash = hash.digest('hex')
        await modelUser.findOneAndUpdate({ mobile }, { password: passwordHash })
        ctx.send()
    } else {
        ctx.send('账号不存在', 422)
    }
    
})

// 小程序端：通过手机号+密码进行登录
router.post('/login', async ctx => {
    const { mobile, password } = ctx.request.body
    // 校验数据格式是否正确 
    Login(mobile, password)
    // 创建hash对象
    const hash = crypto.createHash('sha256').update(password)
    // 生成哈希值 xzp123
    const passwordHash = hash.digest('hex')
    console.log(passwordHash);
    const res = await modelUser.find({ mobile, password: passwordHash }, { mobile: false, my_tags: false }).lean() //通过lean（）把mongoose数据转换为普通的js对象
    // const res = await queryCode(mobile, 'id', 'code')184900913117222703^0    4111
    console.log(res);
    if (res.length > 0) {
        const token = { user_Token: gentoken(res[0].uid) }
        ctx.send('SUCCESS', 200, { ...res[0], ...token })
    } else {
        ctx.send('账号或密码错误！！', 422)
    }
})

// 小程序端：修改个人资料
// 需要利用权限接口，通过解密token为uid，并做对应修改
router.post('/modify-the-user', new Auth().m, async ctx => {
    const { nickname, gender, birthday, city, avatarUrl, backdrop } = ctx.request.body
    Modifytheuser(nickname, gender, birthday, city, avatarUrl, backdrop)
    // 通过调用moment计算年龄
    const age = moment().diff(moment(birthday, 'YYYY-MM-DD'), 'years')
    // console.log(age);
    // 通过权限接口解密token得到uid来对个人资料进行更新
    const res = await modelUser.findOneAndUpdate({ uid: ctx.auth.uid },
        { nickname, gender, birthday, age, city, avatarUrl, backdrop },
        { new: true, selec: 'nickname gender birthday age city avatarurl backdrop' }
    )
    ctx.send('SUCCESS', 200, res)
})
module.exports = router.routes()