const {default:Ecs20140526, SendSmsRequest, QuerySendDetailsRequest} = require('@alicloud/dysmsapi20170525')
const {Config} = require('@alicloud/openapi-client')
const {RuntimeOptions} = require('@alicloud/tea-util')
const account = require('@/config/Account')

// 阿里云验证码服务相关
let config = new Config({
    accessKeyId: account.ALI_KEYID,
    accessKeySecret: account.ALI_KEYSECRET,

})

const client = new Ecs20140526(config)
const runtime = new RuntimeOptions({})

// 发送验证码
const verCode = async function (phoneNumbers) {
    let sendSmsREquest = new SendSmsRequest({
        phoneNumbers: phoneNumbers,
        templateCode: account.ALI_CODE,
        signName: account.ALI_SIGNNAME,
        templateParam: "{\"code\":\"1234\"}",
    })
}
