const GoogleSearch = require('../model/googleSearch')
const MalSearchItem = require('../model/MalSearchItem')
const MalSearchDetailItem = require('../model/MalSearchDetailItem')
const MalSearchCharacterDetailItem = require('../model/MalSearchCharacterDetailItem')
const MalSearchPersonItem = require('../model/MalSearchPersonItem')
const MalSearchRankingItem = require('../model/MalSearchRankingItem');
const { cleanText, malTypeToKorea, appendImageText, dateToFormat } = require('../util/utils');
const MalSearchScheduleItem = require('../model/MalSearchScheduleItem');
const MalSearchGenreItem = require('../model/MalSearchGenreItem');
const MalSearchAllItem = require('../model/MalSearchAllItem');
const { lang } = require('moment')


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

const malAllParsing = (malItems) => {
    try {
        return malItems.map(({ mal_id, title, image_url, airing, start_date, end_date, rated, score, type, episodes }) => {
            return new MalSearchAllItem(mal_id.toString(), title, image_url, airing, start_date, end_date, rated, (score || 0).toString(), (type, episodes || 0).toString());
        })
    } catch (e) {
        console.error(`malAllParsing error ${e}`);
        return false;
    }
}

const malScheduleParsing = (malItems) => {
    try {
        return malItems.map(({ mal_id, title, image_url, score, airing_start }) => {
            return new MalSearchScheduleItem(mal_id.toString(), title, image_url, (score || 0).toString(), airing_start);
        })
    } catch (e) {
        console.error(`malScheduleParsing error ${e}`);
        return false;
    }
}


const malGenreParsing = (malItems) => {
    try {
        return malItems.map(({ mal_id, title, image_url, score, episodes, airing_start, genres }) => {
            const genreArr = genres.map(({ mal_id, name }) => {
                return { genre_id: mal_id, genre_name: name };
            });
            return new MalSearchGenreItem(mal_id, title, image_url, score, episodes, airing_start, genreArr);
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

const malSeasonParsing = (malItems) => {
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

const malJikanSeasonParsing = (limit, malItems) => {
    try {

        let seasonItems = malItems.map(({ mal_id, title, image_url }) => {
            let image = appendImageText(image_url)
            return new MalSearchItem(mal_id, title, image)
        });
        let duplicateArr = [];
        let shuffleArr = [];

        for (let i = 0; i < limit; i++) {
            const randomNo = Math.floor(Math.random() * seasonItems.length)
            if (!duplicateArr.find(no => randomNo === no)) {
                const shuffleItem = seasonItems[randomNo];
                shuffleArr.push(shuffleItem);
                duplicateArr.push(randomNo);
            } else {
                i--;
            }
        }
        return shuffleArr;
    } catch (e) {
        console.error(`malSearchParsing err: ${e}`)
        return false
    }
}

const malSearchRankingParsing = (malItems, ranking_type, limit) => {
    try {
        const rankingItem = {
            type: ranking_type,
            koreaType: malTypeToKorea(ranking_type),
            rank_result: malItems.map(({ mal_id, title, image_url, rank, score }) => {
                return new MalSearchRankingItem(mal_id.toString(), title, image_url, rank.toString(), score.toString())
            }).splice(0, limit)
        }
        return rankingItem;
    } catch (e) {
        console.error(`malSearchParsing err: ${e}`)
        return false
    }
}

const malSearchVideoParsing = (videoItems) => {
    return videoItems.map(({ title, image_url, video_url }) => {
        return { title, image_url, video_url }
    })
}

const malSearchCharacterParsing = (characterItems) => {
    return characterItems.map(({ mal_id, name, role, image_url, url }) => {
        return { character_id: mal_id && mal_id.toString(), name, role, image_url, url }
    })
}

const malSearchCharacterDetailParsing = ({ url, image_url, member_favorites, mal_id, name, name_kanji, nicknames, about, animeography, voice_actors }) => {

    const relate_animes = animeography && animeography.map(({ mal_id, name, image_url }) => {
        return { id: mal_id && mal_id.toString(), title: name, image_url }
    })
    const nickname = nicknames && nicknames.reduce((acc, nick) => {

        if (!acc) acc = nick
        else acc += `,${nick}`
        return acc
    }, "")

    const voice_actors_arr = voice_actors && voice_actors
        .filter(({ language }) => language === "Japanese" || language === 'Korean')
        .map(({ mal_id, name, image_url, language, url }) => {
            return { id: mal_id && mal_id.toString(), name, image_url, country: language, url }
        })

    return new MalSearchCharacterDetailItem(mal_id && mal_id.toString(), name, name_kanji, nickname, cleanText(about), image_url, url
        , relate_animes, voice_actors_arr, member_favorites.toString());

}

const malSearchCharacterPictureParsing = (characterItems) => {
    return characterItems.map(({ large }) => {
        return { image: large }
    })
}

const malSearchPersonParsing = ({ mal_id, name, alternate_names, about, family_name, given_name, voice_acting_roles, url, image_url, birthday, member_favorites }) => {
    const actorRoleArr = voice_acting_roles && voice_acting_roles.reduce((acc, { role, anime: { mal_id, url, image_url, name }, character }) => {

        if (acc.length === 0 || !acc.find(data => data.character.character_id === character.mal_id.toString())) {
            const characterData = { character_id: character.mal_id && character.mal_id.toString(), url: character.url, image_url: character.image_url, name: character.name }
            acc.push({ role, anime: { mal_id: mal_id && mal_id.toString(), url, image_url, name }, character: characterData })
        }
        return acc;
    }, [])
    const alternateName = alternate_names.reduce((acc, name) => {
        if (!acc) acc = name
        else acc += `,${name}`
        return acc
    }, "")
    return new MalSearchPersonItem(mal_id && mal_id.toString(), name || "정보없음", family_name || "정보없음", given_name || "정보없음", birthday || "정보없음", alternateName, image_url, url, actorRoleArr, cleanText(about), member_favorites.toString())
}

const malSearchEpisodeParsing = (episodeItems) => {
    return episodeItems.map(({ episode_id, title, image_url, aired, video_url }) => {
        return { episode_id, title, air_date: dateToFormat(aired), image_url, video_url }
    })
}

const malSearchDetailParsing = async (searchDetailItem) => {
    try {
        //mean 별점수
        const { id, title, main_picture, pictures, start_date, end_date, mean, popularity, rank, synopsis
            , status, genres, start_season, num_episodes, related_anime, recommendations, studios } = searchDetailItem
        const mal_id = id ? id.toString() : "0"
        const score = rank ? rank.toString() : "0"
        const startSeason = start_season ? start_season.year.toString() : start_date
        const star = mean ? mean.toString() : "0"
        const episodes = num_episodes ? num_episodes.toString() : "0"
        const pictureArr = pictures ? pictures.map(img => img.large) : []
        const image = main_picture && main_picture.large

        const genreArr = genres.map(({ id, name }) => {
            return { id: id && id.toString(), name }
        })
        const relatedAnimeArr = related_anime.map(({ node: { id, title, main_picture } }) => {
            const image = main_picture && main_picture.large
            const relate_id = id && id.toString()
            return new MalSearchItem(relate_id, title, image)
        })
        const recommendationsArr = recommendations.map(({ node: { id, title, main_picture } }) => {
            const image = main_picture ? main_picture.large : undefined;
            const recommend_id = id && id.toString()
            return new MalSearchItem(recommend_id, title, image)
        })

        const studioArr = studios.map(({ id, name }) => {
            const studioId = id && id.toString()
            return { id: studioId, name };
        });

        const { translateText } = require('../service/translateService')
        const koreaSynopsis = await translateText('ko', cleanText(synopsis)) || cleanText(synopsis)

        return new MalSearchDetailItem(mal_id, title, image, start_date, end_date, star,
            popularity.toString(), score, koreaSynopsis, status, genreArr, episodes, startSeason, pictureArr, relatedAnimeArr, recommendationsArr, studioArr)
    } catch (err) {
        console.log(`malSearchDetailParsing err :${err}`)
        return false
    }
}

const malSearchJikanDetailParsing = async (searchDetailItem) => {
    try {
        //mean 별점수
        const { mal_id, title, image_url, start_date, end_date, score, popularity, rank, synopsis
            , status, genres, start_season, episodes, related, studios } = searchDetailItem
        const id = mal_id ? mal_id.toString() : "0"
        const rank_point = rank ? rank.toString() : "0"
        const startSeason = start_season ? start_season.year.toString() : start_date
        const star = score ? score.toString() : "0"
        const num_episodes = episodes ? episodes.toString() : "0"
        const image = image_url && appendImageText(image_url)

        const genreArr = genres.map(({ mal_id, name }) => {
            return { id: mal_id && mal_id.toString(), name }
        })

        const relatedAnimeArr = related && Object.keys(related).reduce((acc, key) => {
            related[key].filter(({ type }) => type != 'manga')
                .forEach(({ mal_id, name }) => {
                    acc.push(new MalSearchItem(mal_id, name, ""))
                })
            return acc
        }, [])


        const studioArr = studios.map(({ id, name }) => {
            const studioId = id && id.toString()
            return { id: studioId, name };
        });

        const { translateText } = require('../service/translateService')
        const koreaSynopsis = await translateText('ko', cleanText(synopsis)) || synopsis

        return new MalSearchDetailItem(id, title, image, start_date, end_date, star,
            popularity.toString(), rank_point, koreaSynopsis, status, genreArr, num_episodes, startSeason, undefined, relatedAnimeArr, undefined, studioArr)
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
    translateTextParsing: translateTextParsing,
    malScheduleParsing: malScheduleParsing,
    malGenreParsing: malGenreParsing,
    malSearchVideoParsing: malSearchVideoParsing,
    malAllParsing: malAllParsing,
    malSearchCharacterPictureParsing: malSearchCharacterPictureParsing,
    malSearchEpisodeParsing: malSearchEpisodeParsing,
    malSearchCharacterParsing: malSearchCharacterParsing,
    malSearchPersonParsing: malSearchPersonParsing,
    malSearchCharacterDetailParsing: malSearchCharacterDetailParsing,
    malSeasonParsing: malSeasonParsing,
    malJikanSeasonParsing: malJikanSeasonParsing,
    malSearchJikanDetailParsing: malSearchJikanDetailParsing
}