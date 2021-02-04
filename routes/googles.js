const router = require('express').Router();
const { errMsg, successMsg, successAndFetchData } = require('../util/errorHandle');
const { searchData } = require('../service/googleService')

router.get('/data', async (req, res) => {

    try {
        const query = req.query.q
        const limit = req.query.limit

        if (query) {
            const googleSearchResult = await searchData(query, limit)
            return res.status(200).send(successAndFetchData('구글 검색 성공', googleSearchResult))
        } else {
            console.error('구글 검색 파라미터 입력안됨.')
            return res.status(404).send(errMsg('파라미터 입력 안됨.'))
        }
    } catch (e) {
        console.error(`google search err: ${e}`)
        return res.status(404).send(errMsg(`${e}`))
    }

})

module.exports = router