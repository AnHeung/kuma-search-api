const GoogleSearch = require('../model/googleSearch')
const MalSearchItem = require('../model/MalSearchItem')
const MalSearchDetailItem = require('../model/MalSearchDetailItem')
const MalSearchDetailSimpleItem = require('../model/MalSearchDetailSimpleItem')
const MalSearchRankingItem = require('../model/MalSearchRankingItem');
const {cleanText,malTypeToKorea} = require('../util/utils');
const MalSearchScheduleItem = require('../model/MalSearchScheduleItem');
const MalSearchGenreItem = require('../model/MalSearchGenreItem');


const googleSearchParsing = (searchObj, limit) => {
    const searchItems = searchObj['items']
    if (searchItems) {
        return searchItems.filter(({ title, link, pagemap }) => {
            const page = pagemap || {}
            const cse_image = page && page['cse_image']
            const metatags = page && page['metatags']
            return title && link && (cse_image || metatags)
        })
            .map(({ title, link, pagemap }) => {
                const page = pagemap || {}
                const image = page['cse_image'] && page['cse_image'].length > 0 ? page['cse_image'][0].src : ''
                const meta_image = page['metatags'] && page['metatags'].length > 0 ? page['metatags'][0]["og:image"] : ''
                return new GoogleSearch(title, link, image || meta_image)
            })
            .splice(0, limit || 1)
    } else {
        console.log('검색된 아이템이 없습니다.')
        return false
    }
}

const malScheduleParsing = (malItems)=>{
    try {
        return malItems.map(({mal_id , title,image_url,score, airing_start})=>{
          return new MalSearchScheduleItem(mal_id, title, image_url , score,airing_start);
        })
    } catch (e) {
        console.error(`malScheduleParsing error ${e}`);
        return false;
    }
}


const malGenreParsing = (malItems)=>{
    try {
        return malItems.map(({mal_id , title,image_url,score,episodes, airing_start ,genres})=>{
            const genreArr = genres.map(({mal_id, name})=>{
                return {genre_id : mal_id,genre_name :name};
            });
            return new MalSearchGenreItem(mal_id , title ,image_url , score, episodes , airing_start , genreArr);
        })
    } catch (e) {
        console.error(`malScheduleParsing error ${e}`);
        return false;
    }
}

const malSearchParsing = (malItems) => {
    try {
        return malItems.map(({ node: { id, title, main_picture } }) => {
            const image = (main_picture && main_picture.large) || ''
            return new MalSearchItem(id, title, image)
        })
    } catch (e) {
        console.error(`malSearchParsing err: ${e}`)
        return false
    }
}

const malSearchRankingParsing = (malItems, type) => {
    try {
        return {
            type: type,
            koreaType:malTypeToKorea(type),
            rank_result: malItems.map(({ node: { id, title, main_picture: { large } }, ranking: { rank } }) => {
                return new MalSearchRankingItem(id, title, large, rank)
            })
        }
    } catch (e) {
        console.error(`malSearchParsing err: ${e}`)
        return false
    }
}

const malSearchDetailParsing = async (searchDetailItem, type) => {
    try {
        if (searchDetailItem) {
            
            //mean 별점수
            const { id, title, main_picture: { large }, pictures,start_date, end_date, mean, popularity, rank, synopsis
                , status, genres, start_season,num_episodes, related_anime,recommendations ,studios} = searchDetailItem
            const startSeason = start_season ? start_season.year.toString() : start_date                
            const star = mean ? mean.toString() : "0"
            const pictureArr =  pictures ? pictures.map(img=>img.large) : []

            if (type === 'all') {
                const genresName = genres.reduce((acc, { name }) => {
                    if (!acc) acc = name
                    else acc += `,${name}`
                    return acc
                }, '')
                const relatedAnimeArr = related_anime.map(({ node: { id, title, main_picture } }) => {
                    const image = main_picture ? main_picture.large : undefined;
                    return new MalSearchItem(id, title, image)
                })
                const recommendationsArr = recommendations.map(({ node: { id, title, main_picture } }) => {
                    const image = main_picture ? main_picture.large : undefined;
                    return new MalSearchItem(id, title, image)
                })

                const studioArr = studios.map(({id,name})=>{
                    return {id,name};
                });

                const {translateText} = require('../service/translateService')
                const koreaSynopsis = await translateText('ko', cleanText(synopsis)) || synopsis

                return new MalSearchDetailItem(id, title, large, start_date, end_date, star, popularity.toString(), rank, koreaSynopsis, status, cleanText(genresName), num_episodes.toString(), startSeason, pictureArr,relatedAnimeArr,recommendationsArr,studioArr)
            }
            return new MalSearchDetailSimpleItem(id, title, large, start_date)
        } else {
            console.log('검색된 아이템이 없습니다.')
            return false
        }
    } catch (err) {
        console.log(`malSearchDetailParsing err :${err}`)
        return false
    }
}

const tmdbTitleParsing = (tmdbData) => {
    try {
        return tmdbData.reduce((acc, { name }) => {
            if (!acc && name) acc = name
            return acc
        }, '')
    } catch (e) {
        console.error(`tmdbTitleParsing err: ${e}`)
        return ''
    }
}

const tmdbDetailItemParsing = (tmdbData) => {
    try {
        return tmdbData.reduce((acc, { name }) => {
            if (!acc && name) acc = name
            return acc
        }, '')
    } catch (e) {
        console.error(`tmdbTitleParsing err: ${e}`)
        return ''
    }
}

const translateTextParsing = (resultData) => {
    try {
        const resultText = resultData.translatedText
        return resultText
    } catch (err) {
        console.error(`translateTextParsing err: ${e}`)
        return ''
    }
}


module.exports = {
    googleSearchParsing: googleSearchParsing,
    malSearchParsing: malSearchParsing,
    malSearchDetailParsing: malSearchDetailParsing,
    malSearchRankingParsing: malSearchRankingParsing,
    tmdbTitleParsing: tmdbTitleParsing,
    tmdbDetailItemParsing: tmdbDetailItemParsing,
    translateTextParsing: translateTextParsing  ,
    malScheduleParsing:malScheduleParsing,
    malGenreParsing:malGenreParsing
}