const { searchAnimeItems } = require('./malService');
const { getTvShowTitle } = require('./tmdbService');
const Japanese ='jp'

const getAnimeListToEnglish = async (query, limit) => {
    const languageTitle = await getTvShowTitle(query, Japanese)
    const translateList = languageTitle && await searchAnimeItems(languageTitle, limit)
    return translateList
}

module.exports = {
    getAnimeListToEnglish: getAnimeListToEnglish
}