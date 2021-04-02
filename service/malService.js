const Axios = require('axios');
const { MAL_ACCESS_TOKEN, MAL_CLIENT_ID, MAL_CLIENT_SECRET, MAL_BASE_URL, MAL_JIKAN_URL } = require('../appConstants');
const { malAllParsing, malSearchParsing, malSearchDetailParsing, malSearchRankingParsing, malScheduleParsing ,malGenreParsing} = require('../util/parsing');
const headers = { 'Authorization': `Bearer ${MAL_ACCESS_TOKEN}` }
const { getSeasonText, getYear, getScheduleText, getToday } = require('../util/utils');

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

const searchAllItems = async(type,q,page,status , rated, genre ,score , startDate ,endDate, genre_exclude , limit , sort)=>{

    const start_date = startDate || "2000-01-01"
    const end_date = endDate  || getToday()
    const order_by = "end_date"

    const params = {q,page,status,rated,genre,score, start_date,end_date,genre_exclude,limit,sort,order_by}

    return await Axios.get(`${MAL_JIKAN_URL}/search/${type}`,{params})
    .then(data=>{
        const result = data.data.results;
        if(!result ||result && result.length === 0 ) return false
        return malAllParsing(result);
    })  
    .catch(e=>{
        console.error(`searchAllItems 실패 :${e}`)
        return false;
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

const searchAnimeAllRankingItems = async (rankType, limit) => {

    const typeArr = (!rankType || (rankType && rankType === 'all')) ? ['airing', 'upcoming', 'movie', 'ova', 'tv'] : rankType.split(',');
    console.log(` typeArr ${typeArr} : rankType :${rankType}`);

    return Promise.all(typeArr.map(type => {
        return searchAnimeRankingItems(type, limit)
    }))
        .then(result => result.filter(data => data))
        .catch(e => {
            console.error(`searchAnimeAllRankingItems ${e}`)
            return false
        })
}

const searchScheduleItems = async (day) => {

    const schedule = getScheduleText(day);

    return Axios.get(`${MAL_JIKAN_URL}/schedule/${schedule}`)
        .then(data => {
            const malSchedulItems = data.data[schedule];
            if (!malSchedulItems || malSchedulItems && malSchedulItems.length === 0) return false;
            return malScheduleParsing(malSchedulItems);
        })
        .catch(e => {
            console.error(e);
            return false;
        })
}

const searchGenreItems = async (type, id, page) => {

    return Axios.get(`${MAL_JIKAN_URL}/genre/${type}/${id}/${page}`)
        .then(data => {
            const genreItems = data.data[type];
            if(!genreItems || genreItems && genreItems.length === 0 )return false;
            return malGenreParsing(genreItems);
        })
        .catch(e => {
            console.error(e);
            return false;
        })
}

const searchSeasonItems = async (limit) => {

    const season = getSeasonText();
    const year = getYear();
    const params = { limit };

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
        .then(async (data) => await malSearchDetailParsing(data.data, type))
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
    searchSeasonItems: searchSeasonItems,
    searchScheduleItems: searchScheduleItems,
    searchGenreItems:searchGenreItems,
    searchAllItems:searchAllItems
}