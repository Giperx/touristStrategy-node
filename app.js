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
const login = require('@/routes/user/index')
const vercode = require('@/routes/user/index')
router.use('/apif', login)
router.use('/apif', vercode)
// 将路由绑定到应用
app.use(router.routes()).use(router.allowedMethods())
app.listen(8900)
console.log('端口启动成功')