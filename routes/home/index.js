// 小程序端首页
const router = require('@koa/router')()
const {
    modelDailyrecom,
    modelFourtravel
} = require('@/models/collection-pc')
const {
    modelUser,
    modelArticle,
    modelHometab
} = require('@/models/collection')
const {
    Resreturn,
    Clssifytravels
} = require('@/config/valiData')
const { Auth } = require('@/token/auth')
const { gentoken } = require('@/token/jwt')
const moment = require('moment')
moment.locale('zh-cn')
const { looKup, looKupRecommend } = require('@/config/lookup')
const fs = require('fs')

// 获取小程序端顶部每日推荐游记
router.get('/wxGainDailyRecom', async ctx => {
    const { page } = ctx.query
    Resreturn(page)
    const res = await modelDailyrecom.find({}, {
        time: false, timestamp: false
    })
        .sort({ timestamp: -1 })
        .skip((page - 1) * 1)
        .limit(1)
    // 获取数据总条数
    const count = await modelDailyrecom.countDocuments()
    const resData = { data: res, count }
    ctx.send('SUCCESS', 200, resData)
})

// 获取小程序端四个游记推荐
router.get('/wxGainRecomTravel', async ctx => {
    const res = await modelFourtravel.aggregate([
        { $sort: { timestamp: -1 } },
        looKupRecommend().model_Article,
        looKupRecommend().model_reco_user,
        { $unwind: '$articleData' },
        { $unwind: '$userData' },
        {
            $project: {
                "_id": 1,
                "imageUrl": 1,
                "travel_id": 1,
                "title": "$articleData.title",
                "address": "$articleData.address",
                "fileType": "$articleData.fileType",
                "nickname": "$userData.nickname",
                "avatarUrl": "$userData.avatarUrl"
            }
        }
    ])
    ctx.send('SUCCESS', 200, res)
})

// 获取小程序端10个游记分类
router.get('/recomm-travel', async ctx => {
    const res = await modelHometab.find({})
    ctx.send('SUCCESS', 200, res)
})

// 导入10个游记分类到数据库，一次性导入数据
router.get('/hometab-database', async ctx => {
    return false
    const citydata = fs.readFileSync('hometab.json', 'utf-8')
    const res = JSON.parse(citydata)
    await modelHometab.insertMany(res)
})

// 游记分类切换tab
router.get('/travelogue-class', async ctx => {
    const res = moment().utcOffset(8).format('M') // 获取月份 
    const arr = [
        { name: '推荐', key: '001' },
        { name: `${res}月去哪`, key: '002' },
        { name: '露营', key: '003' },
        { name: '古镇漫游', key: '004' },
        { name: '徒步骑行', key: '005' },
        { name: '宝藏小城', key: '006' },
        { name: '摄影', key: '007' },
        { name: '亲子游', key: '008' },
        { name: '海景', key: '009' },
        { name: '博物馆', key: '010' },
        { name: '民宿', key: '011' },
    ]
    ctx.send('SUCCESS', 200, arr)
})

//获取首页瀑布流游记
router.get('/user-travels', async ctx => {
    const { keywords, page } = ctx.query
    Clssifytravels(keywords, page)
    let match = {}
    if (keywords === '001') {
        match = {}
    } else if (keywords === '002') {
        // 去当前月份月初和月末的时间戳
        const startOfMonth = moment().clone().startOf('month').unix();
        const endOfMonth = moment().clone().endOf('month').unix();
        match = {
            time_stamp: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        }
    } else {
        const arr = [
            { name: '露营', key: '003' },
            { name: '古镇漫游', key: '004' },
            { name: '徒步骑行', key: '005' },
            { name: '躺酒店', key: '006' },
            { name: '宝藏小城', key: '007' },
            { name: '亲子游', key: '008' },
            { name: '博物馆', key: '009' },
            { name: '摄影', key: '010' },
            { name: '海景', key: '011' },
        ]
        const result = arr.filter(item => item.key === keywords)
        match = { tag: { $in: [result[0].name] } }
    }
    const res = await modelArticle.aggregate([
        { $match: match },
        { $sort: { time_stamp: -1 } },
        { $skip: (page - 1) * 6 },
        { $limit: 6 },
        looKup().model_user,
        looKup().model_like,
        looKup().project
    ])
    ctx.send('SUCCESS', 200, res)
})

// 登录校验
router.get('/check-login', new Auth().m, async ctx => {
    const res = await modelUser.find({ uid: ctx.auth.uid })
    if (res.length > 0) {
        ctx.send()
    } else {
        ctx.send('SUCCESS', 401)
    }
})

// 根据游记分类关键词查询游记
router.get('/clAssifyTravels', async ctx => {
    const { keywords, page } = ctx.query
    Clssifytravels(keywords, page)
    const query = { $regex: keywords, $options: 'i' }
    const res = await modelArticle.aggregate([
        {
            $match: {
                $or: [
                    { title: query },
                    { content: query },
                    { tag: { $in: [keywords] } }
                ]
            }
        },
        { $skip: (page - 1) * 6 },
        { $limit: 6 },
        looKup().model_user,
        looKup().model_like,
        looKup().project
    ])
    ctx.send('SUCCESS', 200, res)
})

module.exports = router.routes()