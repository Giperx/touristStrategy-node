// 设计数据库的集合
// 后台管理端信息
const mongoose = require('mongoose')
mongoose.pluralize(null)//去掉集合后面的s
const { Schema, model } = mongoose
const versionKey = { versionKey: false }
const moment = require('moment')
moment.locale('zh-cn')

// 管理员账号
const AdminSchema = new Schema({
    mobile: {//手机号
        type: String,
        unique: true,
        trim: true
    },
    password: {//密码
        type: String,
        trim: true,
        select: false,//私密，不会返回给前端
    },
    admin_uid: {//uid
        type: String,
        unique: true,
        default: () => new Date().getTime()
    },
    avatarUrl: {//头像·
        type: String,
        default: 'https://wx3.sinaimg.cn/mw690/005XpTbZly8hnwimrrl12j30rs0rdq3k.jpg'
    },
    nickname: {//昵称
        type: String,
        default: '默认admin用户',
        trim: true
    }
}, versionKey)

// 每日推荐
const DailyrecomSchema = new Schema({
    imageUrl: String,//封面图
    title: String,//标题
    address: String,//地址
    color: String,//输入框的背景颜色
    time: {
        type: String,
        default: () => moment().utcOffset(8).format('YYYY-MM-DD')
    },
    timestamp: {
        type: Number,
        default: () => moment().unix()
    }
}, versionKey)

// 中国省市数据
const ChcitySchema = new Schema({
    cityName: {
        type: String
    }//市
})
const ProvinceSchema = new Schema({
    provinceName: String,//省
    citys: {//省下辖的市
        type: [ChcitySchema]
    }
}, versionKey)

// 四个推荐游记表
const FourTravelSchema = new Schema({
    imageUrl: String,//封面图
    travel_id: {//关联游记表的_id
        type: mongoose.Types.ObjectId,
        ref: 'usertravel',
        require: true
    },
    time: {
        type: String,
        default: () => moment().utcOffset(8).format('YYYY-MM-DD')
    },
    timestamp: {
        type: Number,
        default: () => moment().unix()
    }
}, versionKey)

module.exports = {
    modelAdministrator: model("administrator", AdminSchema),
    modelDailyrecom: model("dailyrecom", DailyrecomSchema),
    modelProvice: model("chinacity", ProvinceSchema),
    modelFourtravel: model('fourtravel', FourTravelSchema)
}