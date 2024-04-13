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
    nullValue([
        { value: mobile, 'tips': '请输入手机号码' },
        { value: password, 'tips': '请输入密码' }
    ])
}

module.exports = {
    Login
}