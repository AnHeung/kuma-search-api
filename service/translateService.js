const { searchAllItems } = require('./malService');
const { getTvShowTitle } = require('./tmdbService');
const { translateTextParsing } = require('../util/parsing');
const qs = require('qs');
const Axios = require('axios');
const {  NAVER_PAPAGO_API_URL, NAVER_PAPAGO_DETECT_API_URL } = require('../appConstants')

const Japanese = 'ja-JP'

const getAnimeListToEnglish = async (query, limit) => {
    const languageTitle = await getTvShowTitle(query, Japanese)
    const translateList = languageTitle && await searchAllItems("anime", languageTitle)
    return translateList
}

async function translateText (target, text){

    const source = await detectLangType(text)
    const data = qs.stringify({ source, target, text })
    return await Axios({
        url: NAVER_PAPAGO_API_URL,
        method: 'POST',
        data
    })
        .then(data => {
            const resultText = data.data.message.result
            if (resultText) return translateTextParsing(resultText)
            return '';
        })
        .catch(e => {
            console.error(`translateText err : ${e}`)
            return ''
        })
}

const detectLangType = async (text) => {

    const data = qs.stringify({ query: text })

    return await Axios({
        url: NAVER_PAPAGO_DETECT_API_URL,
        method: 'POST',
        data
    })
        .then(data => {
            const resultText = data.data.langCode || 'en'
            return resultText;
        })
        .catch(e => {
            console.error(`detectLangType err : ${e}`)
            return 'en'
        })
}

module.exports = {
    getAnimeListToEnglish: getAnimeListToEnglish,
    translateText: translateText
}