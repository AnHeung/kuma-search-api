const router = require('express').Router();
const { errMsg, successMsg, successAndFetchData } = require('../util/errorHandle');
const { getGenreList,searchAllItems, searchAnimeItems, searchAnimeDetailData, searchAnimeAllRankingItems, searchSeasonItems, searchScheduleItems, searchGenreItems } = require('../service/malService')

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


router.get('/detail/:id/', async (req, res) => {

    try {
        const id = req.params.id

        if (id) {
            const malSearchResult = await searchAnimeDetailData(id)
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


/**
 *  
 * 
 * 타입 type
 Anime Types	Manga Types
    tv	            manga
    ova	            novel
    movie	        oneshot
    special	        doujin
    ona	            manhwa
    music	        manhua

Anime Status	        Manga Status
    airing	             publishing
    completed	         completed
  complete (alias)	     complete (alias)
    to_be_aired	         to_be_published
     tba (alias)	     tbp (alias)
  upcoming (alias)	   upcoming (alias)

rate

g	G - All Ages
pg	PG - Children
pg13	PG-13 - Teens 13 or older
r17	R - 17+ recommended (violence & profanity)
r	R+ - Mild Nudity (may also contain violence & profanity)
rx	Rx - Hentai (extreme sexual content/nudity)

sort
Anime & Manga Sort
ascending
asc (alias)
descending
desc (alias)


genre
Anime Genre	Manga Genre
Action: 1	Action: 1
Adventure: 2	Adventure: 2
Cars: 3	Cars: 3
Comedy: 4	Comedy: 4
Dementia: 5	Dementia: 5
Demons: 6	Demons: 6
Mystery: 7	Mystery: 7
Drama: 8	Drama: 8
Ecchi: 9	Ecchi: 9
Fantasy: 10	Fantasy: 10
Game: 11	Game: 11
Hentai: 12	Hentai: 12
Historical: 13	Historical: 13
Horror: 14	Horror: 14
Kids: 15	Kids: 15
Magic: 16	Magic: 16
Martial Arts: 17	Martial Arts: 17
Mecha: 18	Mecha: 18
Music: 19	Music: 19
Parody: 20	Parody: 20
Samurai: 21	Samurai: 21
Romance: 22	Romance: 22
School: 23	School: 23
Sci Fi: 24	Sci Fi: 24
Shoujo: 25	Shoujo: 25
Shoujo Ai: 26	Shoujo Ai: 26
Shounen: 27	Shounen: 27
Shounen Ai: 28	Shounen Ai: 28
Space: 29	Space: 29
Sports: 30	Sports: 30
Super Power: 31	Super Power: 31
Vampire: 32	Vampire: 32
Yaoi: 33	Yaoi: 33
Yuri: 34	Yuri: 34
Harem: 35	Harem: 35
Slice Of Life: 36	Slice Of Life: 36
Supernatural: 37	Supernatural: 37
Military: 38	Military: 38
Police: 39	Police: 39
Psychological: 40	Psychological: 40
Thriller: 41	Seinen: 41
Seinen: 42	Josei: 42
Josei: 43	Doujinshi: 43
Gender Bender: 44
Thriller: 45

start_date , end_date format yyyy-mm-dd

genre_exclue =>  0 exclude/ 1 include 

 */
router.get('/all', async (req, res) => {

    try {
        const type = req.query.type || "anime"
        const q = req.query.q || undefined
        const page = req.query.page || "1"
        const status = req.query.status || undefined
        const rated = req.query.rated || undefined
        const genre = req.query.genre || undefined
        const score = req.query.score || undefined
        const startDate = req.query.start_date || undefined
        const endDate = req.query.end_date || undefined
        const genre_exclude = req.query.genre_exclude || undefined
        const limit = req.query.limit || undefined
        const sort = req.query.sort || undefined
        
        const allResult =  await searchAllItems(type,q,page,status,rated,genre, score, startDate,endDate, genre_exclude, limit,sort);

        return allResult 
             ? res.status(200).send(successAndFetchData('데이터 검색 성공' , allResult))
             : res.status(200).send(errMsg('검색 결과가 없습니다.'));

    } catch (e) {
        console.error(`MAL search All err: ${e}`)
        return res.status(404).send(errMsg(`${e}`))
    }

})


router.get('/season', async (req, res) => {

    try {

        const limit = req.query.limit || 5;

        const seasonItems = await searchSeasonItems(limit);
        return seasonItems
            ? res.status(200).send(successAndFetchData('시즌리스트 검색 성공 ', seasonItems))
            : res.status(200).send(errMsg('시즌리스트 검색 결과가 없습니다. '))

    } catch (e) {
        console.error(`Season Item 검색 실패 ${e}`)
        return res.status(404).send(errMsg(`Season Item 검색 에러 ${e}`));
    }

})

router.get('/genreList' , async(req,res)=>{
    try {
        const genreArr = getGenreList();
        return res.status(200).send(successAndFetchData('장르리스트 가져오기 성공', genreArr)); 
    } catch (e) {
        return res.status(404).send(errMsg(`장르리스트 가져오기 실패 ${e}`));
    }
})

router.get('/schedule/:day', async (req, res) => {

    try {
        const day = req.params.day

        const scheduleItem = await searchScheduleItems(day);

        return scheduleItem
            ? res.status(200).send(successAndFetchData('스케쥴 검색 성공', scheduleItem))
            : res.status(200).send(errMsg('스케쥴 검색 결과가 없습니다.'));

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
            ? res.status(200).send(successAndFetchData('장르 검색 성공', genreItems))
            : res.status(200).send(errMsg('장르 검색 실패'));
    } catch (e) {
        console.error(`genre Item 검색 에러 ${e}`)
        return res.status(404).send(errMsg(`genre Item 검색 에러 ${e}`));
    }

})

router.get('/ranking/:type/:page/:rank_type/:limit', async (req, res) => {

    try {
        const type = req.params.type || 'anime'
        const page = req.params.page || '1'
        const rank_type = req.params.rank_type || 'airing,upcomming,movie'
        const limit = req.params.limit || '30'

        const malSearchResult = await searchAnimeAllRankingItems(type,page,rank_type,limit)
        return malSearchResult
            ? res.status(200).send(successAndFetchData('MAL 랭킹 검색 성공.', malSearchResult))
            : res.status(200).send(errMsg('MAL 랭킹 검색 실패.'))
    } catch (e) {
        console.error(`MAL Search Ranking err: ${e}`)
        return res.status(404).send(errMsg(`${e}`))
    }
})

module.exports = router