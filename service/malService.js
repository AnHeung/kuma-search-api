const Axios = require('axios');
const { MAL_ACCESS_TOKEN, MAL_AUTH_URL, MAL_CLIENT_ID, MAL_CLIENT_SECRET, MAL_BASE_URL, MAL_JIKAN_URL, MAL_REFRESH_TOKEN } = require('../appConstants');

const { malSearchPersonParsing, malAllParsing, malSearchParsing, malSeasonParsing, malJikanSeasonParsing, malSearchCharacterPictureParsing, malSearchCharacterDetailParsing,
    malSearchJikanDetailParsing, malSearchDetailParsing, malSearchCharacterParsing, malSearchLastEpisodeParsing, malSearchRankingParsing, malSearchEpisodeParsing, malSearchVideoParsing, malScheduleParsing, malGenreParsing } = require('../util/parsing');
const { getSeasonText, getYear, getScheduleText, getFourYearData ,genreList} = require('../util/utils');
const { updateMalConfig } = require('../util/file_utils');

const searchAnimeItems = async (q, limit) => {

    if (!q) {
        console.log(`searchAnimeItems 쿼리 없음.`)
        return false
    }
    const params = { q, limit }
    const headers = await getMalHeaders();

    return Axios.get(MAL_BASE_URL, {
        params,
        headers
    })
        .then(data => {
            const malItems = data.data.data
            if (!malItems || malItems && malItems.length === 0) return false
            return malSearchParsing(malItems)
        })
        .catch(catchErr("searchAnimeItems", () => searchAnimeItems(q, limit)))
}

const searchAllItems = async (type, q, page, status, rated, genre, score, start_date, end_date, genre_exclude, limit, sort, order_by) => {

    const params = { q, page, status, rated, genre, score, start_date, end_date, genre_exclude: "1", limit, sort, order_by }
    const genreAxios = Axios.get(`${MAL_JIKAN_URL}/search/${type}`, { params })

    if (genre_exclude) {
        const genreExcludeParams = { q, page, status, rated, genre: genre_exclude, score, start_date, end_date, genre_exclude: "0", limit, sort, order_by }
        return Promise.all([genreAxios, Axios.get(`${MAL_JIKAN_URL}/search/${type}`, { params: genreExcludeParams })])
            .then(dataResult => {
                const combinedArr = dataResult.reduce((acc, data) => {
                    const result = data.data.results;
                    if (result && result.length > 0) acc = [...acc, ...result];
                    return acc;
                }, [])

                if (!combinedArr || combinedArr && combinedArr.length === 0) return false

                const filteredArr = combinedArr.reduce((acc, data) => {
                    if (!acc.includes(data.mal_id)) {
                        acc.push(data)
                    }
                    return acc;
                }, []).splice(1, 50)

                return malAllParsing(filteredArr);
            })
            .catch(e => {
                console.error(`searchAllItems error :${e}`);
                return false
            })
    }

    return genreAxios
        .then(data => {
            const result = data.data.results;
            if (!result || result && result.length === 0) return false
            return malAllParsing(result);
        })
        .catch(e => {
            console.error(`searchAllItems 실패 :${e}`)
            return false;
        })
}



const searchAnimeRankingItems = async (type, page, ranking_type, limit) => {

    return Axios.get(`${MAL_JIKAN_URL}/top/${type}/${page}/${ranking_type}`)
        .then(data => {
            const malRankingItems = data.data.top
            console.log(`ranking_type : ${ranking_type} , data : ${data.data.top.length}`)
            if (!malRankingItems || malRankingItems && malRankingItems.length === 0) return false
            return malSearchRankingParsing(malRankingItems, ranking_type, limit)
        })
        .catch(e => {
            console.error(`searchAnimeRankingItems err : ${e}`)
            return false
        })
}

const searchAnimeAllRankingItems = async (searchType, page, rankType, limit) => {

    const typeArr = (!rankType || (rankType && rankType === 'all')) ? ['airing', 'upcoming', 'movie', 'ova', 'tv'] : rankType.split(',');
    console.log(` typeArr ${typeArr} : rankType :${rankType}`);

    return Promise.all(typeArr.map(rankType => {
        return searchAnimeRankingItems(searchType, page, rankType, limit)
    }))
        .then(result => result.filter(data => data))
        .catch(e => {
            console.error(`searchAnimeAllRankingItems ${e}`)
            return false
        })
}



//api 가 호출횟수 제한이 있어서 텀을 두고 호출할떄 사용
const searchAnimeAllRankingItemsWait = async (searchType, page, rankType, limit) => {

    const typeArr = (!rankType || (rankType && rankType === 'all')) ? ['airing', 'upcoming', 'movie', 'ova'] : rankType.split(',');
    console.log(` typeArr ${typeArr} : rankType :${rankType}`);
    const resultArr = []

    return typeArr.reduce((promise, rankType) => {
        promise = promise.then(() => {
            return new Promise((res, rej) => {
                setTimeout(async () => {
                    resultArr.push(await searchAnimeRankingItems(searchType, page, rankType, limit))
                    res(resultArr)
                }, 100);
            })
        })
        return promise
    }, Promise.resolve())
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
            if (!genreItems || genreItems && genreItems.length === 0) return false;
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
    const sort = "anime_num_list_users"
    const params = { limit, sort }

    const headers = await getMalHeaders()

    return Axios.get(`${MAL_BASE_URL}/season/${year}/${season}`, {
        params,
        headers
    })
        .then(data => {
            const malSeasonItems = data.data.data
            if (!malSeasonItems || malSeasonItems && malSeasonItems.length === 0) return false
            return malSeasonParsing(malSeasonItems)
        })
        .catch(catchErr("searchSeasonItems", () => searchSeasonItems(limit)))
}

const searchJikanSeasonItems = async (limit) => {

    const season = getSeasonText();
    const year = getYear();

    return Axios.get(`${MAL_JIKAN_URL}/season/${year}/${season}`)
        .then(data => {
            const malSeasonItems = data.data.anime
            if (!malSeasonItems || malSeasonItems && malSeasonItems.length === 0) return false
            return malJikanSeasonParsing(limit, malSeasonItems)
        })
        .catch(e => {
            console.error(`searchSeasonItems err : ${e}`)
            return false
        })
}

const getGenreList = () => {

    return [
        {
            type: "Genre",
            typeKorea: "장르",
            genre_result: genreList
        },
        {
            type: "Year",
            typeKorea: "연도",
            genre_result: getFourYearData()
        },
        {
            type: "Airing",
            typeKorea: "방영",
            genre_result: [
                { category: "방영중", categoryValue: "airing" },
                { category: "완결", categoryValue: "completed" },
                { category: "방영예정", categoryValue: "upcoming" },
            ]

        },
        {
            type: "Rated",
            typeKorea: "등급",
            genre_result: [
                { category: "모두", categoryValue: "g" },
                { category: "어린이", categoryValue: "pg" },
                { category: "13세이하", categoryValue: "pg13" },
                { category: "17세이상", categoryValue: "r17" },
                { category: "성인", categoryValue: "r" },
                { category: "RX", categoryValue: "rx" },
            ]

        },

    ];
}

const searchJikanAnimeDetailData = async (id) => {

    const type = "anime"

    return Axios.get(`${MAL_JIKAN_URL}/${type}/${id}`)
        .then(async (data) => {
            const malItems = data.data
            if (!malItems || malItems && malItems.length === 0) return false
            return malSearchJikanDetailParsing(data.data);
        })
        .catch(e => {
            console.error(`searchJikanAnimeDetailData err : ${e}`)
            return false
        })
}


const searchCharacterPicture = async (characterId) => {

    const type = "character"

    return Axios.get(`${MAL_JIKAN_URL}/${type}/${characterId}/pictures`)
        .then(data => {
            const pictures = data.data.pictures
            if (!pictures || pictures && pictures.length === 0) return false
            return malSearchCharacterPictureParsing(pictures)
        })
        .catch(e => {
            console.error(`searchCharacterPicture error : ${e}`)
            return false
        })
}

const searchPersonData = async (personId) => {

    const type = "person"

    return Axios.get(`${MAL_JIKAN_URL}/${type}/${personId}`)
        .then(data => {
            const personData = data.data
            if (!personData) return false
            return malSearchPersonParsing(personData)
        })
        .catch(e => {
            console.error(`searchPersonData error : ${e}`)
            return false
        })
}


const searchAnimeDetailData = async (id) => {

    const fields = 'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics'

    const params = { fields }

    const headers = await getMalHeaders()

    return Axios.get(`${MAL_BASE_URL}/${id}`, {
        params,
        headers
    })
        .then(data => {
            const malItems = data.data
            if (!malItems || malItems && malItems.length === 0) return false
            return malSearchDetailParsing(malItems);
        })
        .then(async (result) => {
            const videos = await searchAnimeVideos(id)
            if (videos) result.videos = videos;
            return result
        })
        .then(async (result) => {
            const characters = await searchAnimeCharcters(id)
            if (characters) result.characters = characters;
            return result
        })
        .catch(catchErr("searchAnimeDetailData", () => searchAnimeDetailData(id)))
}

const searchAnimeCharcters = async (id) => {

    const type = "anime"

    return Axios.get(`${MAL_JIKAN_URL}/${type}/${id}/characters_staff`)
        .then(data => {
            const characters = data.data.characters
            if (!characters || characters && characters.length === 0) return false
            return malSearchCharacterParsing(characters)
        })
        .catch(e => {
            console.error(`searchAnimeCharcters error : ${e}`)
            return false
        })
}

const searchAnimeCharcterDetail = async (id) => {

    return Axios.get(`${MAL_JIKAN_URL}/character/${id}`)
        .then(data => {
            const character_info = data.data
            if (!character_info) return character_info
            return malSearchCharacterDetailParsing(character_info)
        })
        .then(async result => {
            const pictures = await searchCharacterPicture(id)
            if (pictures && pictures.length > 0) result.pictures = pictures
            return result
        })
        .catch(e => {
            console.error(`searchAnimeCharcterDetail error : ${e}`)
            return false
        })
}

const searchAnimeVideos = async (id) => {
    const type = "anime"

    return Axios.get(`${MAL_JIKAN_URL}/${type}/${id}/videos`)
        .then(data => {
            const videoItems = data.data.promo
            if (!videoItems || videoItems && videoItems.length === 0) return false
            return malSearchVideoParsing(videoItems)
        })
        .catch(e => {
            console.error(`searchAnimeVideos error : ${e}`)
            return false
        })
}

const searchAnimeEpisodes = async (id, page) => {
    const type = "anime"

    return Axios.get(`${MAL_JIKAN_URL}/${type}/${id}/episodes/${page}`)
        .then(data => {
            const episodeItems = data.data
            if (!episodeItems || episodeItems && episodeItems.length === 0) return false
            return episodeItems
        })
        .catch(e => {
            console.error(`searchAnimeEpisodes error : ${e}`)
            return false
        })
}

const searchLastEpisodes = async (id) => {

    const episodesItems = await searchAnimeEpisodes(id, "1")

    if (episodesItems) {
        const lastPage = episodesItems.episodes_last_page
        const episodes = episodesItems.episodes
        if (!lastPage || episodes.length === 0) return false

        if (lastPage === 1) {
            const episodes = episodesItems.episodes
            return malSearchLastEpisodeParsing(episodes)
        }

        const lastEpisodeItems = await searchAnimeEpisodes(id, lastPage);
        if (!lastEpisodeItems) return false
        const lastPageEpisodes = lastEpisodeItems.episodes
        return malSearchLastEpisodeParsing(lastPageEpisodes)
    }
    return false;
}


const catchErr = (msg, callback) => {
    return async (e) => {
        const status = e.response.status

        //401 access_key 만료시 재등록 및 업데이트 로직
        if (status && status === 401) {
            const grant_type = "refresh_token"
            const params = new URLSearchParams();
            params.append('client_id', MAL_CLIENT_ID);
            params.append('client_secret', MAL_CLIENT_SECRET);
            params.append('grant_type', grant_type);
            params.append('refresh_token', await MAL_REFRESH_TOKEN());

            return Axios.post(MAL_AUTH_URL, params)
                .then(async data => {
                    const result = data.data
                    if (result) await updateMalConfig({ access_token: result.access_token, refresh_token: result.refresh_token })
                    return await callback();
                })
                .catch(err => {
                    console.error(`refresh_mal_token error : ${err}`)
                    return false
                })
        } else {
            console.error(`${msg} error : ${e}`)
            return false
        }
    }
}

const getMalHeaders = async () => {
    return { 'Authorization': `Bearer ${await MAL_ACCESS_TOKEN()}` };
}

module.exports = {
    searchAnimeItems: searchAnimeItems,
    searchAnimeDetailData: searchAnimeDetailData,
    searchJikanAnimeDetailData: searchJikanAnimeDetailData,
    searchAnimeRankingItems: searchAnimeRankingItems,
    searchAnimeAllRankingItems: searchAnimeAllRankingItems,
    searchSeasonItems: searchSeasonItems,
    searchCharacterPicture: searchCharacterPicture,
    searchScheduleItems: searchScheduleItems,
    searchPersonData: searchPersonData,
    searchAnimeVideos: searchAnimeVideos,
    searchGenreItems: searchGenreItems,
    searchAnimeCharcterDetail: searchAnimeCharcterDetail,
    searchAnimeCharcters: searchAnimeCharcters,
    searchAnimeEpisodes: searchAnimeEpisodes,
    searchLastEpisodes: searchLastEpisodes,
    searchAllItems: searchAllItems,
    getGenreList: getGenreList,
}