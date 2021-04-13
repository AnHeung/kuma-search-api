const router = require('express').Router();
const { errMsg, successMsg, successAndFetchData } = require('../util/errorHandle');
const { getTvShowTitle, getDetailAnimeItems } = require('../service/tmdbService')

router.get('/title', async (req, res) => {

    try {
        const query = req.query.q
        const language = req.query.lang || 'ko'

        if (query) {
            const tmdbResult = await getTvShowTitle(query, language)
            return tmdbResult ? res.status(200).send(successAndFetchData('TMDB 타이틀 검색 성공', tmdbResult))
                : res.status(200).send(errMsg('TMDB 검색된 값 없음.'))
        } else {
            console.error('TMDB 검색 파라미터 입력안됨.')
            return res.status(200).send(errMsg('TMDB 파라미터 입력 안됨.'))
        }
    } catch (e) {
        console.error(`TMDB search err: ${e}`)
        return res.status(404).send(errMsg(`${e}`))
    }
})

module.exports = router