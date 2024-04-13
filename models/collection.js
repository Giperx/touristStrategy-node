// 设计数据库的集合
const mongoose = require('mongoose')
mongoose.pluralize(null) // 去掉自动生成的s
const { Schema, model } = mongoose
const versionKey = { versionKey: false }

// Schema定义数据库集合的数据模型
        
// 用户账号
const UserSchema = new Schema({
    // name: String,
    // age: Number,
    mobile: String,
    password: String
}, versionKey) // 去掉自动生成版本__v


// model创建集合
module.exports = {
    modelUser: model('user', UserSchema) // 名为user的集合
}