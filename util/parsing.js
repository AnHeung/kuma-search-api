const GoogleSearch = require('../model/googleSearch')

const googleSearchParsing = (searchObj, count) => {
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
            .splice(0, count || 1)
    } else {
        console.log('검색된 아이템이 없습니다.')
        return false
    }
}


module.exports = {
    googleSearchParsing: googleSearchParsing
}