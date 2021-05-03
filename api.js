const path = require('path');
require('dotenv-flow').config({
    node_env: process.env.NODE_ENV || 'dev',
    silent: true
});
const { getSearchCache } = require('./service/apiService')
const { errMsg, successMsg, successAndFetchData } = require('./util/errorHandle');

const express = require('express')
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 4506

if (process.env.NODE_ENV === "prod") {
    app.use(morgan("combined"));
} else {
    // development
    app.use(morgan("dev"));
}
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))


app.use('/google', require('./routes/googles'))

/**
 * mal api 로 넘기기전 캐시서버로 할지 api태울지 검증하는 미들웨어
 */

app.use('/mal', async (req, res, next) => {
    try {
        const baseUrl = req.originalUrl
        if (baseUrl) {
            const result = await getSearchCache(baseUrl)
            if (result) return res.status(200).send(successAndFetchData('MAL Seach Cache 검색 성공.', result))
            return next()
        }
    } catch (e) {
        console.error(`mal middleWare error : ${e}`)
        return next()
    }
}, require('./routes/mals'))
app.use('/tmdb', require('./routes/tmdbs'))
app.use('/translate', require('./routes/translates'))

app.listen(port, () => console.log(`Server listening on port ${port}`))