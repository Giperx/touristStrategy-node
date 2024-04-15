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



module.exports = {
    Login,
    Vercode,
    Mobileregistration,
    Uploadpassword,
    Modifytheuser
}