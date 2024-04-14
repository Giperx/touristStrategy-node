// 校验各种前端传回的数据是否符合规范（某些必填字段、电话或邮箱格式等）
const result = require('@/config/handle')

// 校验为undefined
function unDefined(arrAy) {
    arrAy.forEach(item => { // 遍历每个数据
        if (item === undefined) {
            throw new result('参数填写undefined，检验参数设定！！', 400)
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

// 登录数据校验
const Login = (mobile, password) => {
    unDefined([mobile, password])
    nullValue([ // 校验是否为空
        { value: mobile, 'tips': '输入为空，请输入手机号码' },
        { value: password, 'tips': '输入为空，请输入密码' }
    ])
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

module.exports = {
    Login,
    Vercode,
    Mobileregistration
}