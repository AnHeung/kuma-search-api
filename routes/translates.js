const router = require('express').Router();
const { errMsg, successMsg, successAndFetchData } = require('../util/errorHandle');
const { getAnimeListToEnglish } = require('../service/translateService')

router.get('/title', async (req, res) => {

    try {
        const query = req.query.q
        const limit = req.query.limit || '10'

        if (query) {
            const tmdbResult = await getAnimeListToEnglish(query, limit)
            return tmdbResult
                ? res.status(200).send(successAndFetchData('TMDB 타이틀 검색 성공', tmdbResult))
                : res.status(404).send(errMsg('TMDB 파라미터 입력 안됨.'))
        } else {
            console.error('TMDB 검색 파라미터 입력안됨.')
            return res.status(404).send(errMsg('TMDB 파라미터 입력 안됨.'))
        }
    } catch (e) {
        console.error(`TMDB search err: ${e}`)
        return res.status(404).send(errMsg(`${e}`))
    }
})


router.get('/detail', async (req, res) => {

    try {
        const id = parseInt(req.query.id)
        const type = req.query.type

        if (id) {
            const malSearchResult = await searchAnimeDetailData(id, type)
            return malSearchResult
                ? res.status(200).send(successAndFetchData('MAL 검색 성공.', malSearchResult))
                : res.status(404).send(errMsg('MAL 검색 실패.'))
        } else {
            console.error('MAL 아이디 파라미터 입력안됨.')
            return res.status(404).send(errMsg('MAL 아이디 파라미터 입력 안됨.'))
        }
    } catch (e) {
        console.error(`MAL search 아이디 err: ${e}`)
        return res.status(404).send(errMsg(`${e}`))
    }
})

router.get('/ranking', async (req, res) => {

    try {
        const search_type = req.query.search_type
        const limit = req.query.limit || '10'
        const rank_type = req.query.ranking_type || 'all'

        const malSearchResult = search_type === 'all' ?
            await searchAnimeAllRankingItems(limit)
            : await searchAnimeRankingItems(rank_type, limit)
        return malSearchResult
            ? res.status(200).send(successAndFetchData('MAL 랭킹 검색 성공.', malSearchResult))
            : res.status(404).send(errMsg('MAL 랭킹 검색 실패.'))
    } catch (e) {
        console.error(`MAL Search Ranking err: ${e}`)
        return res.status(404).send(errMsg(`${e}`))
    }
})

module.exports = router