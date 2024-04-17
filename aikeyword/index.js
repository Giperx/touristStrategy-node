const axios = require('axios')
const tokenurl = 'https://aip.baidubce.com/oauth/2.0/token?'
const keywordurl = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/txt_keywords_extraction?access_token='
const account = require('@/config/Account')
const qs = require('querystring')
const { log } = require('console')
const result = require('@/config/handle')

// 百度鉴权认证机制
const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': account.BAIDU_CLIENT_ID,
    'client_secret': account.BAIDU_CLIENT_SECRET
})

const aiKeyword = async (text) => {
    try {
        let token = await axios.get(tokenurl + param)
        // console.log(token.data.access_token);
        //24.a6615bcefbfc4efda9050e109326b53b.2592000.1715788250.282335-61598685
        let res = await axios({
            url: keywordurl + token.data.access_token,
            data: { "text": [text], 'num': 10 },
            method: 'post'
        })
        // console.log(res.data.results);
        if (res.data.results) {
            return res.data.results
        } else {
            return []
        }
    } catch (error) {
        // console.log(error);
        throw new result(error, 500)
    }
}

module.exports = aiKeyword