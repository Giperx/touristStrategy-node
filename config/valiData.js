// 校验各种前端传回的数据是否符合规范（某些必填字段、电话或邮箱格式等）
const result = require('@/config/handle')

// 校验为undefined
function unDefined(arrAy) {
    arrAy.forEach(item => { // 遍历每个数据
        if (item === undefined) {
            throw new result('参数填写undefined，检验参数设定：名称与必填项！！', 400)
        }
    })
} 

// 校验是否传入空数据
function nullValue(arrAy) {
    arrAy.forEach(item => {
        if (typeof (item.value) == 'string') {
            if (item.value.trim() === '') {
                throw new result(item.tips, 422)
            }
        }
    })
}

// 手机号+密码登录数据校验
const Login = (mobile, password) => {
    unDefined([mobile, password])
    nullValue([ // 校验是否为空
        { value: mobile, 'tips': '输入为空，请输入手机号码' },
        { value: password, 'tips': '输入为空，请输入密码' }
    ])
    if (!mobilever.test(mobile)) {
        throw new result('请输入正确格式的手机号码！！', 422)
    }
}

// 发送验证码相关，对手机号校验
const mobilever = /^1[3-9]\d{9}$/
const Vercode = (phoneNumbers) => {
    unDefined([phoneNumbers])
    nullValue([
        { value : phoneNumbers, 'tips' : '输入为空，请输入手机号码' }
    ]) // 校验是否为空
    if (!mobilever.test(phoneNumbers)) {
        throw new result('请输入正确格式的手机号码！！', 422)
    }
}

// 匹配小程序端：通过 手机号+验证码 进行登录
// 对前端传回数据进行规范校验
const Mobileregistration = (mobile, code, bizId) => {
    unDefined([mobile, code, bizId])
    nullValue([
        { value: mobile, 'tips': '输入为空，请输入手机号码' },
        { value: code, 'tips': '输入为空，请输验证码' },
        { value: bizId, 'tips' : '输入为空，请输入bizId(调试相关)' }
    ]) // 校验是否为空
    if (!mobilever.test(mobile)) {
        throw new result('请输入正确格式的手机号码！！', 422)
    }
}

// 密码校验：6-20位数字和字母结合
const passwordver = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/
// 匹配小程序端：设置修改密码
// 对前端传回数据进行规范校验
const Uploadpassword = (mobile, code, bizId, password) => {
    unDefined([mobile, code, bizId, password])
    nullValue([
        { value: mobile, 'tips': '输入为空，请输入手机号码' },
        { value: code, 'tips': '输入为空，请输验证码' },
        { value: bizId, 'tips' : '输入为空，请输入bizId(调试相关)' },
        { value: password, 'tips': '输入为空，请输密码' }
    ]) // 校验是否为空
    if (!mobilever.test(mobile)) {
        throw new result('请输入正确格式的手机号码！！', 422)
    }
    if (!passwordver.test(password)) {
        throw new result('请输入正确格式的密码！！(6-20位数字和字母组成)', 422)
    }
}

// 匹配小程序端：修改个人资料
// 对输入的资料数据进行校验
const Modifytheuser = (nickname, gender, birthday, city, avatarUrl, backdrop ) => {
    unDefined([nickname, gender, birthday, city, avatarUrl, backdrop])
    nullValue([
        { value: nickname, 'tips': '输入为空，请输入昵称' },
        { value: gender, 'tips': '输入为空，请输入性别' },
        { value: birthday, 'tips' : '输入为空，请输入生日' },
        { value: city, 'tips': '输入为空，请输入城市' },
        { value: avatarUrl, 'tips': '输入为空，请上传头像' },
        { value: backdrop, 'tips': '输入为空，请上传背景图片' }
    ]) 
}

// 匹配小程序端：分析游记关键词
const Articlekeyword = (text) => {
    unDefined([text])
}

// 匹配小程序端：发布图片类型游记
const Articlepblish = (title, content, image, city, address, province, tag) => {
    unDefined([title, content, image, city, address, province, tag])
    nullValue([
        { value: title, 'tips': '请填写标题' },
        { value: content, 'tips': '请输入游记内容' },
        { value: image, 'tips': '请上传图片' },
        { value: city, 'tips': '请选择城市' },
        { value: address, 'tips': '请选择城市' },
        { value: province, 'tips': '请选择城市' },
        { value: tag, 'tips': '请添加标签' }
    ])
    if (!Array.isArray(image)) {
        throw new result('image字段应为数组类型', 422)
    }
    if (image.length === 0) {
        throw new result('请上传图片', 422)
    }
    if (!Array.isArray(tag)) {
        throw new result('tag字段应为数组类型', 422)
    }
    if (tag.length === 0) {
        throw new result('请添加标签', 422)
    }
}

// 匹配小程序端：发布视频类型的游记
const ArticlepblishVideo = (title, content, city, address, province,
    tag, videoPoster, videoUrl, videoWidth, videoHeight) => {
    unDefined([title, content, city, address, province,
        tag, videoPoster, videoUrl, videoWidth, videoHeight])
    nullValue([
        { value: title, 'tips': '请填写标题' },
        { value: content, 'tips': '请输入游记内容' },
        { value: city, 'tips': '请选择城市' },
        { value: address, 'tips': '请选择城市' },
        { value: province, 'tips': '请选择城市' },
        { value: tag, 'tips': '请添加标签' },
        { value: videoPoster, 'tips': '请上传封面图' },
        { value: videoUrl, 'tips': '请上传视频' },
        { value: videoWidth, 'tips': '缺少视频宽度' },
        { value: videoHeight, 'tips': '缺少视频高度' }
    ])
    if (!Array.isArray(tag)) {
        throw new result('tag字段应为数组类型', 422)
    }
    if (tag.length === 0) {
        throw new result('请添加标签', 422)
    }
}

// 注册账号：管理员端，私有，并未开放给前端
const Adminregister = (mobile, password) => {
    unDefined([mobile, password])
    nullValue([
        { value: mobile, tips: '请输入手机号' },
        { value: password, tips: '请填写密码' }
    ])
    // 校验手机号码格式
    if (!mobilever.test(mobile)) {
        throw new result('请输入正确的手机号', 422)
    }
    // 校验密码格式
    if (!passwordver.test(password)) {
        throw new result('密码需由6-20位数字和字母结合', 422)
    }
}

// 匹配后台管理端：更新管理员头像和昵称
const ModifyuserInfor = (_id, avatarUrl, nickname) => {
    unDefined([_id, avatarUrl, nickname])
    nullValue([
        { value: _id, tips: '缺少_id' },
        { value: avatarUrl, tips: '请上传头像' },
        { value: nickname, tips: '请填写昵称' }
    ])
}

// 匹配后台管理端：上传每日推荐
const Dailyrecom = (imageUrl, title, address, color) => {
    unDefined([imageUrl, title, address, color])
    nullValue([
        { value: imageUrl, tips: '请上传封面图' },
        { value: title, tips: '请填写标题' },
        { value: address, tips: '请选择地址' },
        { value: color, tips: '请选择颜色' }
    ])
}

// 搜索省市数据
const Searchtravel = (keywords) => {
    unDefined([keywords])
}

// 匹配后台管理端：获取每日推荐
const Resreturn = (page) => {
    unDefined([page])
    nullValue([
        { value: page, tips: '缺少分页page值' }
    ])
}

// 匹配后台管理端：删除每日推荐，删除推荐游记
// 匹配小程序端：用户点赞、取消点赞
const CompanionDetails = (_id) => {
    unDefined([_id])
    nullValue([
        { value: _id, tips: '缺少_id值' }
    ])
}
// 提交四个推荐
const Uploadfourtravel = (imageUrl, travel_id) => {
    unDefined([imageUrl, travel_id])
    nullValue([
        { value: imageUrl, tips: '请上传图片' },
        { value: travel_id, tips: '请选择一个游记关联' }
    ])
}

// 匹配后台管理端：修改更新四个推荐游记
const Modifyfourtravel = (_id, imageUrl, travel_id) => {
    unDefined([_id, imageUrl, travel_id])
    nullValue([
        { value: _id, tips: '缺少_id' },
        { value: imageUrl, tips: '请上传图片' },
        { value: travel_id, tips: '请选择一个游记关联' }
    ])
}

// 用户评论游记
const Comment = (article_id, comment_content) => {
    unDefined([article_id, comment_content])
    nullValue([
        { value: article_id, tips: '缺少_id' },
        { value: comment_content, tips: '请填写评论内容' }
    ])
}
// 获取游记的评论数据
const Commentget = (article_id, page) => {
    unDefined([article_id, page])
    nullValue([
        { value: article_id, tips: '缺少_id' },
        { value: page, tips: '缺少分页值' }
    ])
}

// 关注接口
const Userconcern = (im_concerned_uid) => {
    unDefined([im_concerned_uid])
    nullValue([
        { value: im_concerned_uid, tips: '缺少作者uid' }
    ])
}

// 获取首页瀑布流游记
const Clssifytravels = (keywords, page) => {
    unDefined([keywords, page])
    nullValue([
        { value: keywords, tips: '缺少分类查询值keywords' },
        { value: page, tips: '缺少分页page值' }
    ])
}

// 根据定位获取当地游记
const Localtravels = (page, address) => {
    unDefined([page, address])
    nullValue([
        { value: page, tips: '缺少分页page值' },
        { value: address, tips: '缺少地址address值' }
    ])
}

// 当地玩法：按地址和游记分类关键词查询游记
const Addressquerytravels = (address, keywords, page) => {
    unDefined([address, keywords, page])
    nullValue([
        { value: address, tips: '缺少地址address值' },
        { value: keywords, tips: '缺少查询keywords值' },
        { value: page, tips: '缺少分页page值' },
    ])
}

// 用户根据分类选择地址
const Chooseaddress = (type) => {
    unDefined([type])
    nullValue([
        { value: type, tips: '缺少type查询值' }
    ])
}

// 发起结伴
const InitiatingPartner = (
    description,
    image,
    city,
    full_address,
    companion_time,
    number_of_people) => {
    unDefined([
        description,
        image,
        city,
        full_address,
        companion_time,
        number_of_people])
    nullValue([
        { value: description, tips: '请填写描述' },
        { value: image, tips: '请上传图片' },
        { value: city, tips: '请选择目的地' },
        { value: full_address, tips: '请选择目的地' },
        { value: companion_time, tips: '请选择结伴时间' },
        { value: number_of_people, tips: '请选择希望人数' }
    ])
    if (!Array.isArray(image)) {
        throw new result('image字段应为数组类型', 422)
    }
    if (image.length === 0) {
        throw new result('请上传图片', 422)
    }
}

// 报名结伴
const SignupPartner = (
    signup_id,
    contact_inform,
    gender,
    introduce) => {
    unDefined([
        signup_id,
        contact_inform,
        gender,
        introduce])
    nullValue([
        { value: signup_id, tips: '缺少_id' },
        { value: contact_inform, tips: '请填写联系方式' },
        { value: gender, tips: '请选择性别' },
        { value: introduce, tips: '请填写自我介绍' },
    ])
}

// 首页筛选活动
const CompanionQuery = (city, keyword, page) => {
    unDefined([city, keyword, page])
    nullValue([
        { value: city, tips: '缺少选择城市city查询值' },
        { value: keyword, tips: '缺少选择月份keyword查询值' },
        { value: page, tips: '缺少分页page值' },
    ])
}

module.exports = {
    Login,
    Vercode,
    Mobileregistration,
    Uploadpassword,
    Modifytheuser,
    Articlekeyword,
    Articlepblish,
    ArticlepblishVideo,
    Adminregister,
    ModifyuserInfor,
    Dailyrecom,
    Resreturn,
    CompanionDetails,
    Uploadfourtravel,
    Modifyfourtravel,
    Comment,
    Commentget,
    Userconcern,
    Clssifytravels,
    Localtravels,
    Addressquerytravels,
    Chooseaddress,
    InitiatingPartner,
    SignupPartner,
    CompanionQuery,
    Searchtravel,
    
}