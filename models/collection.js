// 设计数据库的集合
const mongoose = require('mongoose')
mongoose.pluralize(null) // 去掉自动生成的s
const { Schema, model } = mongoose
const versionKey = { versionKey: false }

// Schema定义数据库集合的数据模型
        
// 用户账号
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
    my_tag: { // 用户感兴趣的旅游攻略标签
        type: Array,
        default: []
    }

}, versionKey) // 去掉自动生成版本__v


// model创建集合
module.exports = {
    modelUser: model('user', UserSchema) // 名为user的集合
}