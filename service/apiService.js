const Axios = require('axios');
const { API_SERVER_CACHE_URL } = require('../appConstants');
const { isTwoDayPassed, getToday } = require('../util/utils');

const updateSearchCache = async (key, data) => {

    const params = { key, data }

    return Axios.post(API_SERVER_CACHE_URL, params )
        .then(data)
        .catch(e => {
            console.error(`updateSearchCache err : ${e}`)
            return false    
        })
}

const getSearchCache = async (key) => {

    const params = {key}

    return Axios.get(API_SERVER_CACHE_URL,{params})
        .then(result => {
            const err = result.data.err
            const date = result.data.updatedAt || getToday();
            // if (err || isTwoDayPassed(date)) return false;
            if(err) return false
            return result.data.data
        })
        .catch(e => {
            console.error(`getSearchCache err : ${e}`)
            return false
        })
}

module.exports = {
    getSearchCache: getSearchCache,
    updateSearchCache: updateSearchCache
}