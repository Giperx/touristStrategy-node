const router = require('@koa/router')()
const {
    modelAdministrator,
    modelDailyrecom,
    modelProvice,
    modelFourtravel
} = require('@/models/collection-pc')
const {
    modelUser,
    modelArticle,
    modelConcern
} = require('@/models/collection')
const {
    Adminregister,
    ModifyuserInfor,
    Dailyrecom,
    Resreturn,
    CompanionDetails,
    Uploadfourtravel,
    Modifyfourtravel,
    Searchtravel
} = require('@/config/valiData')
const { Auth } = require('@/token/auth')
const crypto = require('crypto')
const { gentoken } = require('@/token/jwt')
const moment = require('moment')
moment.locale('zh-cn')
const { upload, cosUpdate } = require('@/cos/cos')
const { log } = require('console')
const fs = require('fs')
const { looKup, looKupRecommend } = require('@/config/lookup')

// 注册管理员账号
// 没有开放给前端，仅开发管理人员使用
router.post('/adminRegister', async ctx => {
    const { mobile, password } = ctx.request.body
    Adminregister(mobile, password)
    // console.log('111');
    const res = await modelAdministrator.find({ mobile }).lean()
    if (res.length > 0) {
        ctx.send('账号已经存在', 422)
    } else {
        // 创建哈希对象
        const hash = crypto.createHash('sha256').update(password)
        // 生成哈希值//xzp123
        const passwordHash = hash.digest('hex')
        await modelAdministrator.create({ mobile, password: passwordHash })
        ctx.send('注册成功', 200)
    }
})

// 后台管理端：账号+密码登录
router.post('/adminLogin', async ctx => {
    const { mobile, password } = ctx.request.body
    Adminregister(mobile, password)
    // 创建哈希对象
    const hash = crypto.createHash('sha256').update(password)
    // 生成哈希值//xzp123
    const passwordHash = hash.digest('hex')
    const res = await modelAdministrator.find({
        mobile, password: passwordHash
    },
        { mobile: false }
    ).lean()
    if (res.length > 0) {
        const token = { user_Token: gentoken(res[0].admin_uid) }
        ctx.send('SUCCESS', 200, { ...res[0], ...token })
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNzEzMjc4MjE2ODc2Iiwic2NvcGUiOiJhZG1pbiIsImlhdCI6MTcxMzI4MTEzNSwiZXhwIjoxNzM5MjAxMTM1fQ.qD4RdVCZEUVzn6wu3h3_-piNquzzBxzc66RxaytZsyg
    } else {
        ctx.send('账号或者密码错误', 422)
    }
})

// 后台管理端：头像上传
// 后台管理端：头像图片上传
router.post('/imageUpload', upload.array('file', 6), async ctx => {
    const res = await cosUpdate(ctx.files)
    ctx.send('SUCCESS', 200, res)
}) 

// 后台管理端：更新管理员头像和昵称
router.post('/modifyUserInfor', new Auth().m, async ctx => {
    const { _id, avatarUrl, nickname } = ctx.request.body
    ModifyuserInfor(_id, avatarUrl, nickname)
    await modelAdministrator.findByIdAndUpdate({ _id }, {
        avatarUrl, nickname
    })
    ctx.send()
})

// 上传每日推荐
router.post('/dailyRecom', new Auth().m, async ctx => {
    const { imageUrl, title, address, color } = ctx.request.body
    Dailyrecom(imageUrl, title, address, color)
    await modelDailyrecom.create({ imageUrl, title, address, color })
    ctx.send()
})

// 导入省市到数据库，仅测试一次，供后续模糊查询时使用
router.get('/insert-database', async ctx => {
    return false
    const citydata = fs.readFileSync('china.json', 'utf-8')
    const res = JSON.parse(citydata)
    await modelProvice.insertMany(res)
    console.log('111');
})


// 搜索省市数据，后台管理端与小程序端共用，使用模糊匹配
router.get('/china-data', async ctx => {
    const { keywords } = ctx.query
    Searchtravel(keywords)
    if (keywords.trim() === '') {
        ctx.send('SUCCESS', 200, [])
        return false
    }
    const regex = new RegExp(keywords, 'i')
    // aggregate:聚合查询
    //$match用来查询
    //$or或者
    const res = await modelProvice.aggregate([ // 聚合管道
        {//第一个阶段：查询
            $match: {
                $or: [
                    { provinceName: regex },//匹配省
                    { 'citys.cityName': regex }//匹配市
                ]
            }
        },
        {
            $project: {//$project:可以指定返回前端哪些字段，可以在里面做逻辑处理
                _id: 0,//0表示不返回，1表示返回
                provinceName: 1,
                citys: {
                    $filter: {//用户筛选符合条件的城市
                        input: '$citys',//表示对哪个字段进行处理
                        as: 'city',//指定变量值
                        cond: {//进行逻辑处理
                            $or: [
                                //匹配市
                                { $regexMatch: { input: '$$city.cityName', regex } },
                                { $regexMatch: { input: '$provinceName', regex } }
                            ]
                            //$regexMatch:正则匹配
                        }
                    }
                }
            }
        }
    ])
    ctx.send('SUCCESS', 200, res)
})

// 后台管理端：获取每日推荐
router.get('/gainDailyRecom', new Auth().m, async ctx => {
    const { page } = ctx.query
    Resreturn(page)
    const res = await modelDailyrecom.find({}, { timestamp: false })
        .sort({ timestamp: -1 })
        .skip((page - 1) * 6)
        .limit(6)
    // 获取数据总条数
    const count = await modelDailyrecom.countDocuments()
    const resData = { data: res, count }
    ctx.send('SUCCESS', 200, resData)
})

// 后台管理端：删除某个每日推荐
router.get('/deleteDailyRecom', new Auth().m, async ctx => {
    const { _id } = ctx.query
    CompanionDetails(_id)
    await modelDailyrecom.deleteMany({ _id })
    ctx.send()
})

// 获取所有用户的游记：用作关联推荐
router.get('/allUserTravel', new Auth().m, async ctx => {
    const { page } = ctx.query
    Resreturn(page)
    const res = await modelArticle.aggregate([ // 聚合查询
        { $sort: { time_stamp: -1 } },//按创建时间倒序查询
        { $skip: (page - 1) * 10 },
        { $limit: 10 },
        looKup().model_user,//关联用户表
        {
            $project: {
                "_id": 1,
                "title": 1,
                "address": 1,
                "time": 1,
                "author_data.nickname": 1
            }
        }
    ])
    // 获取游记总条数
    const count = await modelArticle.countDocuments()
    const resObj = { data: res, count }
    ctx.send('SUCCESS', 200, resObj)
})

// 后台管理端：提交四个推荐
router.post('/uploadFourTravel', new Auth().m, async ctx => {
    const { imageUrl, travel_id } = ctx.request.body
    Uploadfourtravel(imageUrl, travel_id)
    await modelFourtravel.create({ imageUrl, travel_id })
    ctx.send()
})

// 后台管理端：获取四个推荐游记
router.get('/gainRecomTravel', new Auth().m, async ctx => {
    const res = await modelFourtravel.aggregate([
        { $sort: { timestamp: -1 } },
        looKupRecommend().model_Article,
        looKupRecommend().model_reco_user,
        { $unwind: '$articleData' }, // 平铺展开数组
        { $unwind: '$userData' },
        {
            $project: {
                "_id": 1,
                "imageUrl": 1,
                "time": 1,
                "travel_id": 1,
                "articltTime": "$articleData.time",
                "nickname": "$userData.nickname"
            }
        }
    ])
    ctx.send('SUCCESS', 200, res)
})

// 后台管理端：修改更新四个推荐游记
router.post('/modifyRecomTravel', new Auth().m, async ctx => {
    const { _id, imageUrl, travel_id } = ctx.request.body
    Modifyfourtravel(_id, imageUrl, travel_id)
    await modelFourtravel.findByIdAndUpdate({ _id },
        { imageUrl, travel_id })
    ctx.send()
})

// 后台管理端：删除推荐游记
router.get('/deleteRecomTravel', new Auth().m, async ctx => {
    const { _id } = ctx.query
    CompanionDetails(_id)
    await modelFourtravel.deleteMany({ _id })
    ctx.send()
})

// 游记管理：获取全部游记
router.get('/travelManaGement', new Auth().m, async ctx => {
    const { page } = ctx.query
    Resreturn(page)
    const res = await modelArticle.aggregate([
        { $sort: { time_stamp: -1 } },//按创建时间倒序查询
        { $skip: (page - 1) * 10 },
        { $limit: 10 },
        looKup().model_user,
        {
            $project: {
                _id: 1,
                title: 1,
                content: 1,
                image: 1,
                videoUrl: 1,
                fileType: 1,
                city: 1,
                address: 1,
                province: 1,
                time: 1,
                cover_image: 1,
                "author_data.avatarUrl": 1,
                "author_data.nickname": 1,
            }
        }
    ])
    const count = await modelArticle.countDocuments()
    const resObj = { data: res, count }
    ctx.send('SUCCESS', 200, resObj)
})

// 用户管理：获取所有用户信息
router.get('/allUserInfor', new Auth().m, async ctx => {
    const { page } = ctx.query
    Resreturn(page)
    const res = await modelUser.aggregate([
        { $skip: (page - 1) * 10 },
        { $limit: 10 },
        {
            $lookup: {//关联游记表，获取游记总数
                from: modelArticle.collection.name,
                localField: 'uid',
                foreignField: 'author_uid',
                as: 'articleQuantity'
            }
        },
        {
            $lookup: {//关联关注表，获取粉丝数
                from: modelConcern.collection.name,
                localField: 'uid',
                foreignField: 'im_concerned_uid',
                as: 'concernQuantity'
            }
        },
        {
            $project: {
                _id: 1,
                avatarUrl: 1,
                nickname: 1,
                uid: 1,
                mobile: 1,
                //计算粉丝数量
                "concernQuantity": { $size: "$concernQuantity" },
                //计算发表文章数量
                "articleQuantity": { $size: "$articleQuantity" },
            }
        }
    ])
    const count = await modelUser.countDocuments()
    const resObj = { data: res, count }
    ctx.send('SUCCESS', 200, resObj)
})
module.exports = router.routes()