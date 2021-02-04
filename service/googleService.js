const Axios = require('axios');
const { GOOGLE_SEARCH_BASE_URL, GOOGLE_SEARCH_API_KEY, GOOGLE_SEARCH_ENGINE_ID } = require('../appConstants');
const { googleSearchParsing } = require('../util/parsing');

const searchData = async (q, count) => {

    if (!q) {
        console.log(`searchImage 쿼리 없음.`)
        return false
    }

    const key = GOOGLE_SEARCH_API_KEY
    const cx = GOOGLE_SEARCH_ENGINE_ID
    const params = { key, cx, q }

    return await Axios.get(GOOGLE_SEARCH_BASE_URL, { params })
        .then(data => googleSearchParsing(data.data, count))
        .catch(e => {
            console.error(`searchImage err : ${e}`)
            return false
        })
}

module.exports = {
    searchData: searchData,

}