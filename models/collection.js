// 设计数据库的集合
const mongoose = require('mongoose')
mongoose.pluralize(null) // 去掉自动生成的s
const { Schema, model } = mongoose
const versionKey = { versionKey: false }

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
// model创建集合
module.exports = {
    modelUser: model('user', UserSchema) // 名为user的集合
    modelArticle: model('usertravel', ArticleSchema) // 存游记相关
}