const Axios = require('axios');
const { MAL_ACCESS_TOKEN, MAL_CLIENT_ID, MAL_CLIENT_SECRET, MAL_BASE_URL, MAL_JIKAN_URL } = require('../appConstants');
const { malAllParsing, malSearchParsing,malSeasonParsing,malJikanSeasonParsing, malSearchDetailParsing, malSearchRankingParsing, malScheduleParsing ,malGenreParsing} = require('../util/parsing');
const headers = { 'Authorization': `Bearer ${MAL_ACCESS_TOKEN}` }
const { getSeasonText, getYear, getScheduleText, getToday,getFourYearData } = require('../util/utils');

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



const searchAnimeRankingItems = async (type, page,ranking_type,limit) => {

    return await Axios.get(`${MAL_JIKAN_URL}/top/${type}/${page}/${ranking_type}`, {
        headers
    })
        .then(data => {
            const malRankingItems = data.data.top
            if (!malRankingItems || malRankingItems && malRankingItems.length === 0) return false
            return malSearchRankingParsing(malRankingItems, ranking_type,limit)
        })
        .catch(e => {
            console.error(`searchAnimeRankingItems err : ${e}`)
            return false
        })
}

const searchAnimeAllRankingItems = async (searchType, page, rankType,limit) => {

    const typeArr = (!rankType || (rankType && rankType === 'all')) ? ['airing', 'upcoming', 'movie', 'ova', 'tv'] : rankType.split(',');
    console.log(` typeArr ${typeArr} : rankType :${rankType}`);

    return Promise.all(typeArr.map(rankType => {
        return searchAnimeRankingItems(searchType,page, rankType,limit)
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
    const params = {limit}

    return await Axios.get(`${MAL_BASE_URL}/season/${year}/${season}`, {
        params,
        headers
    })
        .then(data => {
            const malSeasonItems = data.data.data
            if (!malSeasonItems || malSeasonItems && malSeasonItems.length === 0) return false
        return malSeasonParsing(malSeasonItems)
        })
        .catch(e => {
            console.error(`searchSeasonItems err : ${e}`)
            return false
        })
}

const searchJikanSeasonItems = async (limit) => {

    const season = getSeasonText();
    const year = getYear();

    return await Axios.get(`${MAL_JIKAN_URL}/season/${year}/${season}`, {
        headers
    })
        .then(data => {
            const malSeasonItems = data.data.anime
            if (!malSeasonItems || malSeasonItems && malSeasonItems.length === 0) return false
        return malJikanSeasonParsing(limit,malSeasonItems)
        })
        .catch(e => {
            console.error(`searchSeasonItems err : ${e}`)
            return false
        })
}

const getGenreList = ()=>{

    return [
        {
            type:"genre",
            typeKorea:"장르",
            result:[
                {category:"액션" , categoryValue:"1"},
                {category:"어드벤쳐" , categoryValue:"2"},
                {category:"코미디" , categoryValue:"4"},
                {category:"드라마" , categoryValue:"8"},
                {category:"헨타" , categoryValue:"12"},
                {category:"호러" , categoryValue:"14"},
                {category:"음악" , categoryValue:"19"},
                {category:"패러디" , categoryValue:"20"},
                {category:"로맨스" , categoryValue:"22"},
                {category:"우주" , categoryValue:"29"},
                {category:"스포츠" , categoryValue:"30"},
                {category:"유리" , categoryValue:"35"},
                {category:"밀리터리" , categoryValue:"38"},
                {category:"스릴러" , categoryValue:"41"},
                {category:"동인" , categoryValue:"43"},
            ]

        },
        {
            type:"year",
            typeKorea:"연도",
            result:getFourYearData()
        },
        {
            type:"air",
            typeKorea:"방영",
            result:[
                {category:"방영중" , categoryValue:"airing"},
                {category:"완결" , categoryValue:"completed"},
                {category:"방영예정" , categoryValue:"upcoming"},
            ]

        },
        {
            type:"rated",
            typeKorea:"등급",
            result:[
                {category:"모두" , categoryValue:"g"},
                {category:"어린이" , categoryValue:"pg"},
                {category:"13세이하" , categoryValue:"pg13"},
                {category:"17세이상" , categoryValue:"r17"},
                {category:"성인" , categoryValue:"r"},
                {category:"ㅇㅇ" , categoryValue:"rx"},
            ]

        },
        
    ];
}


const searchAnimeDetailData = async (id) => {

    const fields = 'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics'
    
    const params = { fields }

    return await Axios.get(`${MAL_BASE_URL}/${id}`, {
        params,
        headers
    })
        .then(async (data) => {
            const malItems = data.data
            if(!malItems || malItems && malItems.length === 0) return false
            return await malSearchDetailParsing(data.data);
        })
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
    searchAllItems:searchAllItems,
    getGenreList:getGenreList
}