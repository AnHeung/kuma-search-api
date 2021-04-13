const router = require('express').Router();
const { errMsg, successMsg, successAndFetchData } = require('../util/errorHandle');
const { getAnimeListToEnglish, translateText } = require('../service/translateService');

router.get('/title', async (req, res) => {

    try {
        const query = req.query.q
        const limit = req.query.limit || '10'

        if (query) {
            const tmdbResult = await getAnimeListToEnglish(query, limit)
            return tmdbResult
                ? res.status(200).send(successAndFetchData('타이틀 검색 성공', tmdbResult))
                : res.status(200).send(errMsg('검색결과가 없습니다.'))
        } else {
            console.error('TMDB 검색 파라미터 입력안됨.')
            return res.status(200).send(errMsg('검색 파라미터 입력안됨.'))
        }
    } catch (e) {
        console.error(`TMDB search err: ${e}`)
        return res.status(404).send(errMsg(`${e}`))
    }
})


router.get('/text', async (req, res) => {

    try {
        const target = req.query.target
        const text = req.query.text

        if (text) {
            const resultText = await translateText(target, text)
            return resultText
                ? res.status(200).send(successAndFetchData('translateText  성공.', resultText))
                : res.status(200).send(errMsg('translateText 실패.'))
        } else {
            console.error('번역 파라미터 입력안됨.')
            return res.status(200).send(errMsg('번역 파라미터 입력 안됨.'))
        }
    } catch (e) {
        console.error(`translate text err: ${e}`)
        return res.status(404).send(errMsg(`${e}`))
    }
})


module.exports = router