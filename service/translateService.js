const { searchAnimeItems } = require('./malService');
const { getTvShowTitle } = require('./tmdbService');

const getAnimeListToTranslate = async (query, language) => {
    const languageTitle = await getTvShowTitle(query, language)
    const translateList = languageTitle && await searchAnimeItems(languageTitle)
    return translateList
}

module.exports = {
    getAnimeListToTranslate: getAnimeListToTranslate
}