// 设计数据库的集合
// 小程序端信息
const mongoose = require('mongoose')
mongoose.pluralize(null) // 去掉自动生成的s
const { Schema, model } = mongoose
const versionKey = { versionKey: false }
const moment = require('moment')
moment.locale('zh-cn')
// Schema定义数据库集合的数据模型
        
// 用户账号信息表
const UserSchema = new Schema({
    mobile: {
        type: String,
        unique: true, // 唯一
        trim: true, // 去空格
    },
    password: {
        type: String,
        select: false, // 密码不传回前端
        default : '' // 密码默认为空
    },
    uid: {
        type: String,
        unique: true, // 唯一
        default : () => new Date().getTime()
    },
    avatarUrl: { 
        type: String, // 默认头像地址
        default : 'https://imgb14.photophoto.cn/20200801/shiliangshangwutouxiang-38305697_3.jpg'
    },
    nickname: {
        type: String,
        default: 'momo',
        trim: true
    },
    gender: {
        type: String,
        default: '男'
    },
    birthday: {
        type: String,
        default: ''
    },
    age: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    backdrop: {
        type: String,
        default: 'https://picm9.photophoto.cn/70/30/70030999_mockup.jpg'
    },
    my_tags: { // 用户感兴趣的旅游攻略标签
        type: Array,
        default: []
    }

}, versionKey) // 去掉自动生成版本__v

// 用户发表：游记相关信息表
const ArticleSchema = new Schema({
    author_uid: String,//游记作者uid
    author_id: { type: mongoose.Types.ObjectId, ref: 'user', required: true },//关联用户表
    title: {//游记标题
        type: String,
        trim: true
    },
    content: String,//文章内容
    cover_image: {//封面图
        url: String,
        width: Number,
        height: Number
    },
    image: {//图片的合集
        type: Array,
        default: [],
    },
    videoUrl: {//短视频的链接
        url: {
            type: String,
            default: ''
        },
        width: {
            type: Number,
            default: 0
        },
        height: {
            type: Number,
            default: 0
        }
    },
    fileType: {//判断文件类型：image:'图片'；video:视频
        type: String,
        default: 'image'
    },
    city: String,//城市
    address: String,//详细地址
    province: String,//省
    tag: {//标签
        type: Array,
        default: []
    },
    time: {//发表时间
        type: String,
        default: () => moment().utcOffset(8).format('YYYY-MM-DD')
    },
    time_stamp: {//发表时间戳, 方便后续的排序操作
        type: Number,
        default: () => moment().unix()
    }
}, versionKey)

// 小程序端首页10个游记分类
const HometabSchema = new Schema({
    icon: String,//icon图标
    text: String//分类
}, versionKey)

// 点赞表
const LikeSchema = new Schema({
    user_uid: String,//点赞用户uid
    author_uid: String,//作者uid
    user_id: {//关联用户表
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    article_id: {//关联游记表
        type: mongoose.Types.ObjectId,
        ref: 'usertravel',
        required: true
    }
}, versionKey)

// 收藏表
const CollectionSchema = new Schema({
    user_uid: String,//收藏用户uid
    author_uid: String,//作者uid
    user_id: {//关联用户表
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    article_id: {//关联游记表
        type: mongoose.Types.ObjectId,
        ref: 'usertravel',
        required: true
    },
    time: {
        type: String,
        default: () => moment().utcOffset(8).format('YYYY-MM-DD')
    }
}, versionKey)

// 评论表
const CommentSchema = new Schema({
    user_uid: String,//收藏用户uid
    author_uid: String,//作者uid
    user_id: {//关联用户表
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    article_id: {//关联游记表
        type: mongoose.Types.ObjectId,
        ref: 'usertravel',
        required: true
    },
    time: {
        type: String,
        default: () => moment().utcOffset(8).format('YYYY-MM-DD')
    },
    content: {//评论内容
        type: String,
        trim: true
    }
}, versionKey)

// 关注表
const ConcernSchema = new Schema({
    user_uid: String,//A关注B，A用户的uid
    im_concerned_uid: String//A关注B，B用户的uid
}, versionKey)

// 目的地：当地玩法
const LocalSchema = new Schema({
    image: String,//图标
    categories: String,//分类
    color: String//颜色值
}, versionKey)

// 目的地界面选择城市，左边的国家分类
const CountrySchema = new Schema({
    country: String,//国家
    type: String,//类型
}, versionKey)

// 目的地界面选择城市，右边的国家
const CitySchema = new Schema({
    image: String,//图片地址
    city: String,//城市
    type: String,//类型
}, versionKey)

// 发起结伴表
const CompanionSchema = new Schema({
    uid: String,//发起人的uid
    description: String,//描述
    image: Array,//图片合集
    city: String,//目的地城市
    full_address: String,//目的地详细地址
    companion_time: String,//结伴时间
    companion_timestamp: Number,//结伴时间时间戳
    number_of_people: Number,//希望人数
    time: {//提交时间
        type: String,
        default: () => moment().utcOffset(8).format('YYYY-MM-DD')
    },
    timestamp: {//提交时间时间戳
        type: Number,
        default: () => moment().unix()
    }
}, versionKey)

// 结伴报名表
const SignupSchema = new Schema({
    signup_id: {//关联发起结伴表
        type: mongoose.Types.ObjectId,
        ref: 'companion',
        required: true
    },
    user_uid: String,//报名用户uid
    contact_inform: String,//联系方式
    gender: Number,//性别,0:女，1：男
    introduce: String,//自我介绍
    time: {//提交时间
        type: String,
        default: () => moment().utcOffset(8).format('YYYY-MM-DD')
    },
    timestamp: {//提交时间时间戳
        type: Number,
        default: () => moment().unix()
    }
}, versionKey)

// model创建集合
module.exports = {
    modelUser: model('user', UserSchema), // 名为user的集合
    modelArticle: model('usertravel', ArticleSchema),  // 存游记相关
    modelHometab: model('hometab', HometabSchema),
    modelLike: model('like', LikeSchema),
    modelCollection: model('collection', CollectionSchema),
    modelComment: model('comment', CommentSchema),
    modelConcern: model('concern', ConcernSchema),
    modelLocal: model('localgameplay', LocalSchema),
    modelCity: model('city', CitySchema),
    modelCountry: model('country', CountrySchema),
    modelCompanion: model('companion', CompanionSchema),
    modelSignup: model('signup', SignupSchema)
}
