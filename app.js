const Koa = require('koa')
const app = new Koa()
const json = require('koa-json') // 用于将http响应的数据转换为json格式
const bodyParser = require('koa-bodyparser') //解析http请求的消息体
const router = require('@koa/router')()
const cors = require('@koa/cors')//允许跨域
const mongoose = require('mongoose')
const { addAliases } = require('module-alias')
// 配置别名
addAliases({
    '@':__dirname
})
// 数据库地址
const { BASE_URL } = require('@/config/Account') 
// 中间件接口规范，统一返回前端数据格式
const responseHandler = require('@/config/result') // 注入
// 错误捕获中间件
const errorHandler = require('@/config/abnormal')

app.use(cors())
app.use(json())
app.use(bodyParser())
app.use(responseHandler)
app.use(errorHandler)

// 连接数据库
mongoose.connect(BASE_URL)
    .then(res => {
        console.log('成功连接数据库');
})
    .catch(err => {
        console.log('连接数据库失败');
    })



//----所有接口
//--------------接口小程序端----------------
// 登录注册用户账号
const login = require('@/routes/user/index')
// 游记
const article = require('@/routes/article/index')
// 首页
const home = require('@/routes/home/index')
// 搜索游记
const search = require('@/routes/search-travel/index')
// 目的地
const found = require('@/routes/found/index')
// 旅游结伴
const companion = require('@/routes/companion/index')

//--------------接口后台管理端----------------
const pcapi = require('@/routes/pc-admin/index')
// 数据分析
const analysis = require('@/routes/pc-data-analysis/index')

router.use('/apif', login)
router.use('/apif', article)
router.use('/apif', pcapi)
router.use('/apif', home)
router.use('/apif', search)
router.use('/apif', found)
router.use('/apif', companion)
router.use('/apif', analysis)
// 将路由绑定到应用
app.use(router.routes()).use(router.allowedMethods())
app.listen(8900)
console.log('端口启动成功')