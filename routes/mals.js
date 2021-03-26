const router = require('express').Router();
const { errMsg, successMsg, successAndFetchData } = require('../util/errorHandle');
const { searchAnimeItems, searchAnimeDetailData, searchAnimeAllRankingItems, searchSeasonItems, searchScheduleItems, searchGenreItems } = require('../service/malService')

router.get('/data', async (req, res) => {

    try {
        const query = req.query.q
        const limit = req.query.limit

        if (query) {
            const malSearchResult = await searchAnimeItems(query, limit)
            return res.status(200).send(successAndFetchData('MAL 검색 성공', malSearchResult))
        } else {
            console.error('MAL 검색 파라미터 입력안됨.')
            return res.status(200).send(errMsg('MAL 파라미터 입력 안됨.'))
        }
    } catch (e) {
        console.error(`MAL search err: ${e}`)
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
                : res.status(200).send(errMsg('MAL 검색 실패.'))
        } else {
            console.error('MAL 아이디 파라미터 입력안됨.')
            return res.status(200).send(errMsg('MAL 아이디 파라미터 입력 안됨.'))
        }
    } catch (e) {
        console.error(`MAL search 아이디 err: ${e}`)
        return res.status(404).send(errMsg(`${e}`))
    }
})

router.get('/season', async (req, res) => {

    try {

        const limit = req.query.limit || 5;

        const seasonItems = await searchSeasonItems(limit);
        return seasonItems
            ? res.status(200).send(successAndFetchData('Season Item 검색 성공 ', seasonItems))
            : res.status(200).send(errMsg('Season Item 검색 실패 '))

    } catch (e) {
        console.error(`Season Item 검색 실패 ${e}`)
        return res.status(404).send(errMsg(`Season Item 검색 실패 ${e}`));
    }

})

router.get('/schedule/:day', async (req, res) => {

    try {
        const day = req.params.day

        const scheduleItem = await searchScheduleItems(day);

        return scheduleItem
            ? res.status(200).send(successAndFetchData('schedule item 검색 성공', scheduleItem))
            : res.status(200).send(errMsg('schedule item 검색 실패'));

    } catch (e) {
        console.error(`schedule Item 검색 실패 ${e}`)
        return res.status(404).send(errMsg(`schedule Item 검색 실패 ${e}`));
    }

})

router.get('/genre/:type/:id/:page', async (req, res) => {
    try {

        const type = req.params.type || 'anime';
        const id = req.params.id || "1";
        const page = req.params.page || "1";

        const genreItems = await searchGenreItems(type, id, page);

        return genreItems
            ? res.status(200).send(successAndFetchData('genre Item 검색 성공',genreItems))
            : res.status(200).send(errMsg('genre Item 검색 실패'));
    } catch (e) {
        console.error(`genre Item 검색 실패 ${e}`)
        return res.status(404).send(errMsg(`genre Item 검색 실패 ${e}`));
    }

})

router.get('/ranking', async (req, res) => {

    try {
        const limit = req.query.limit || '30'
        let rank_type = req.query.ranking_type

        const malSearchResult = await searchAnimeAllRankingItems(rank_type, limit)
        return malSearchResult
            ? res.status(200).send(successAndFetchData('MAL 랭킹 검색 성공.', malSearchResult))
            : res.status(200).send(errMsg('MAL 랭킹 검색 실패.'))
    } catch (e) {
        console.error(`MAL Search Ranking err: ${e}`)
        return res.status(404).send(errMsg(`${e}`))
    }
})

module.exports = router