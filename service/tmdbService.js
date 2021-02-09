const Axios = require('axios');
const { TMDB_API_KEY, TMDB_BASE_URL } = require('../appConstants');
const { tmdbTitleParsing, tmdbDetailItemParsing } = require('../util/parsing');
const languageKoFormat = 'ko'
const params = { api_key: TMDB_API_KEY, include_adult: true, language: languageKoFormat }

// https://api.themoviedb.org/3/search/tv?query=%EC%B6%95%EB%B3%B5%EC%9D%84&api_key=c754bdb019b983b0a38b2bf59e2eb10b&page=1&include_adult=false&language=ko

const getTvShowTitle = async (query, language) => {

    if (!query) {
        console.log(`getTvShowTitle 쿼리 없음.`)
        return false
    }
    params["query"] = query
    params["language"] = language

    return await Axios.get(`${TMDB_BASE_URL}search/tv`, {
        params
    })
        .then(data => {
            const resultData = data.data.results
            if (resultData && Array.isArray(resultData)) return tmdbTitleParsing(resultData)
            return ''
        })
        .catch(e => {
            console.error(`getTvShowTitle err : ${e}`)
            return ''
        })
}


const getDetailAnimeItems = async (id, language) => {

    params["language"] = language

    return await Axios.get(`${TMDB_BASE_URL}tv/${id}`, {
        params
    })
        .then(data => {
            const tmdbItems = data.data
            if (!tmdbItems) return false
            return tmdbItems
            // return tmdbDetailItemParsing(tmdbItems)
        })
        .catch(e => {
            console.error(`getDetailAnimeItems err : ${e}`)
            return []
        })
}

const searchAnimeAllRankingItems = async (limit) => {

    const typeArr = ['airing', 'upcoming', 'movie']

    return Promise.all(typeArr.map(type => {
        return searchAnimeRankingItems(type, limit)
    }))
        .then(data => data)
        .catch(e => {
            console.error(e)
        })
}

module.exports = {
    getTvShowTitle: getTvShowTitle,
    getDetailAnimeItems: getDetailAnimeItems
}