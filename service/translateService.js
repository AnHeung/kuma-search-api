const { searchAnimeItems } = require('./malService');
const { getTvShowTitle } = require('./tmdbService');
const ENGLISH ='en-us'

const getAnimeListToEnglish = async (query, limit) => {
    const languageTitle = await getTvShowTitle(query, ENGLISH)
    const translateList = languageTitle && await searchAnimeItems(languageTitle, limit)
    return translateList
}

module.exports = {
    getAnimeListToEnglish: getAnimeListToEnglish
}