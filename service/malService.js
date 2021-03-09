const Axios = require('axios');
const { MAL_ACCESS_TOKEN, MAL_CLIENT_ID, MAL_CLIENT_SECRET, MAL_BASE_URL } = require('../appConstants');
const { malSearchParsing, malSearchDetailParsing, malSearchRankingParsing } = require('../util/parsing');
const headers = { 'Authorization': `Bearer ${MAL_ACCESS_TOKEN}` }
const {getSeasonText,getYear} = require('../util/utils');

const searchAnimeItems = async (q, limit) => {

    if (!q) {
        console.log(`searchAnimeItems 쿼리 없음.`)
        return false
    }
    const params = { q, limit }

    return await Axios.get(MAL_BASE_URL, {
        params,
        headers
    })
        .then(data => {
            const malItems = data.data.data
            if (!malItems || malItems && malItems.length === 0) return false
            return malSearchParsing(malItems)
        })
        .catch(e => {
            console.error(`searchAnimeItems err : ${e}`)
            return false
        })
}



const searchAnimeRankingItems = async (ranking_type, limit) => {

    const params = { ranking_type, limit }

    return await Axios.get(`${MAL_BASE_URL}/ranking`, {
        params,
        headers
    })
        .then(data => {
            const malRankingItems = data.data.data
            if (!malRankingItems || malRankingItems && malRankingItems.length === 0) return false
            return malSearchRankingParsing(malRankingItems, ranking_type)
        })
        .catch(e => {
            console.error(`searchAnimeRankingItems err : ${e}`)
            return false
        })
}

const searchAnimeAllRankingItems = async (limit) => {

    const typeArr = ['airing', 'upcoming', 'movie','ova' ,'tv']

    return Promise.all(typeArr.map(type => {
        return searchAnimeRankingItems(type, limit)
    }))
        .then(result=>result.filter(data=>data))
        .catch(e => {
            console.error(`searchAnimeAllRankingItems ${e}`)
            return false
        })
}

const searchSeasonItems = async (limit) => {

    const season =  getSeasonText();
    const year = getYear();
    const params = {limit};

    return await Axios.get(`${MAL_BASE_URL}/season/${year}/${season}`, {
        params,
        headers
    })
        .then(data => {
            const malSeasonItems = data.data.data
            if (!malSeasonItems || malSeasonItems && malSeasonItems.length === 0) return false
            return malSearchParsing(malSeasonItems)
        })
        .catch(e => {
            console.error(`searchSeasonItems err : ${e}`)
            return false
        })
}


const searchAnimeDetailData = async (id, type) => {

    if (!id) {
        console.log(`searchAnimeDetailData id값 없음.`)
        return false
    }
    const fields = type === 'all'
        ? 'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics'
        : 'id,title,main_picture,start_date'

    const params = { fields }

    return await Axios.get(`${MAL_BASE_URL}/${id}`, {
        params,
        headers
    })
        .then(async (data) =>await malSearchDetailParsing(data.data, type))
        .catch(e => {
            console.error(`searchAnimeDetailData err : ${e}`)
            return false
        })
}

module.exports = {
    searchAnimeItems: searchAnimeItems,
    searchAnimeDetailData: searchAnimeDetailData,
    searchAnimeRankingItems: searchAnimeRankingItems,
    searchAnimeAllRankingItems: searchAnimeAllRankingItems,
    searchSeasonItems:searchSeasonItems
}