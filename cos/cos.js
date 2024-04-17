// 上传图片到腾讯云COS（对象存储）
const multer = require('@koa/multer');
const COS = require('cos-nodejs-sdk-v5');
const account = require('@/config/Account')

const cos = new COS({
    SecretId: account.QQ_SECRETID,
    SecretKey: account.QQ_SECRETKEY,
    FileParallelLimit: 6, // 最大文件上传并发数
    ChunkParallelLimit: 6,
    Protocol: 'https',
    UseAccelerate: false
});


// 上传图片到服务器端
const storage = multer.diskStorage({ // 磁盘存储 
    filename: (req, file, cb) => {
        // 利用时间戳重命名，避免出现相同名字图片
        let fileFormat = (file.originalname).split(".")
        let newCode = `${new Date().getTime()}${"."}${fileFormat[fileFormat.length - 1]}`
        cb(null, newCode)
    }
})

const upload = multer({ storage })

// 上传到腾讯云
const cosUpdate = (value) => {
    return new Promise((resolve, reject) => {
        const resFile = []
        const files = value.map(item => {
            return {
                Bucket: account.QQ_BUCKET, /* 存储桶，必须字段 */
                Region: account.QQ_REGION,  /* 存储桶所在地域，例如 ap-beijing，必须字段 */
                Key: `${account.QQ_FOLDER}${item.filename}`,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
                FilePath: item.path,
            }
        })
        cos.uploadFiles({ files })
            .then(res => {
                console.log(res.files);
                res.files.forEach(item => resFile.push(`https://${item.data.Location}`))
                resolve(resFile)
            })
            .catch(err => {
                reject(err)
            })
    })
}

module.exports = {
    upload, cosUpdate
}