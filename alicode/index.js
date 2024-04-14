const {default:Ecs20140526, SendSmsRequest, QuerySendDetailsRequest} = require('@alicloud/dysmsapi20170525')
const {Config} = require('@alicloud/openapi-client')
const {RuntimeOptions} = require('@alicloud/tea-util')
const account = require('@/config/Account')
const { generateCode } = require('@/alicode/gencode')
const result = require('@/config/handle')
const moment = require('moment')
moment.locale('zh-cn') // 定位国内使用
// 阿里云验证码服务相关
let config = new Config({
    accessKeyId: account.ALI_KEYID,
    accessKeySecret: account.ALI_KEYSECRET,

})

const client = new Ecs20140526(config)
const runtime = new RuntimeOptions({})

// 发送验证码
const verCode = async function (phoneNumbers) {
    let sendSmsRequest = new SendSmsRequest({
        phoneNumbers: phoneNumbers,
        templateCode: account.ALI_CODE,
        signName: account.ALI_SIGNNAME,
        templateParam: `{"code":${generateCode()}}`,
    });

    try {
        const res = await client.sendSmsWithOptions(sendSmsRequest, runtime); 
        console.log(res);
        return res
    } catch (error) {
        // console.log(error);
        throw new result('验证码发送失败！！', 500, error)
    }
}

// 检验验证码是否正确
const queryCode = async function (phoneNumber, bizId, code) {
    const sendDate = moment().format('YYYYMMDD')
    let querySendDetailsRequest = new QuerySendDetailsRequest({
        phoneNumber,
        sendDate,
        pageSize: 10,
        currentPage: 1,
        bizId,
    });

    try {
        const res = await client.querySendDetailsWithOptions(querySendDetailsRequest, runtime);
        console.log(res);
        if (res.body.code === 'OK') {
            if (res.body.smsSendDetailDTOs.smsSendDetailDTO.length === 0) {
                throw { message: '手机号没有发送过验证码！！', code: 422 }
            }
            else {
                const str = res.body.smsSendDetailDTOs.smsSendDetailDTO[0].content;
                const nums = str.match(/\d+/g).map(Number) //利用正则表达式去检索数字，返回可能是数组[123, 456]
                console.log(nums);
                // 提却到验证码后与前端传回的code进行校验
                if (code == nums[1]) {
                    return 'SUCCESS'
                } else {
                    throw { message: '验证码输入错误！！', code: 422 }
                }

            }
        }else { // 查询调用出错
                throw { message: res.body.message, code: 422 }
        }
    } catch (error) {
        console.log(error);
        throw new result(
            error.message ? error.message : '出现未知错误！！',
            error.code ? error.code : 500,
            error.error ? null : error,
        )
    }
}

module.exports = {
    verCode,
    queryCode
}
