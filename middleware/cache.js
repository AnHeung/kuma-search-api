const { getSearchCache } = require('../service/apiService')
const {successAndFetchData} = require('../util/errorHandle')

module.exports = async (req, res, next) => {
        try {
            const baseUrl = req.originalUrl
            if (baseUrl) {
                const result = await getSearchCache(baseUrl)
                if (result) return res.status(200).send(successAndFetchData('MAL Seach Cache 검색 성공.', result))
                next()
            }
        } catch (e) {
            console.error(`mal middleWare error : ${e}`)
            next()
        }
}