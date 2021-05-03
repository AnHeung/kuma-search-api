const Axios = require('axios');
const { API_SERVER_CACHE_URL } = require('../appConstants');
const { isTwoDayPassed } = require('../util/utils');

const updateSearchCache = async (key, data) => {

    const params = {key,data}

    return await Axios.post(API_SERVER_CACHE_URL, params)
        .then(data)
        .catch(e => {
            console.error(`insertSearchCache err : ${e}`)
            return false
        })
}

const getSearchCache = async (key) => {

    return await Axios.get(API_SERVER_CACHE_URL, {
        params: {
            key
        }
    })
        .then(result => {
            const err = result.data.err
            if(err || isTwoDayPassed(result.data.data.updatedAt)) return false;
            return result.data.data
        })
        .catch(e => {
            console.error(`getSearchCache err : ${e}`)
          return false
        })
}

module.exports = {
    getSearchCache: getSearchCache,
    updateSearchCache:updateSearchCache
}