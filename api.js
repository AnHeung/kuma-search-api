(async()=>{

const path = require('path');
require('dotenv-flow').config({
    node_env: process.env.NODE_ENV || 'dev',
    silent: true
});
const auth = require('./middleware/auth');
const cache = require('./middleware/cache');

const axios = require('axios')
const {API_KEY, API_KEY_VALUE , MAL_ACCESS_TOKEN ,NAVER_PAPAGO_CLIENT_ID, NAVER_PAPAGO_CLIENT_SECRET} = require('./appConstants')
axios.defaults.headers.common[API_KEY] = API_KEY_VALUE
axios.defaults.headers.common['Authorization'] = `Bearer ${await MAL_ACCESS_TOKEN()}`
axios.defaults.headers.common['X-Naver-Client-Id'] = `${NAVER_PAPAGO_CLIENT_ID}`
axios.defaults.headers.common['X-Naver-Client-Secret'] = `${NAVER_PAPAGO_CLIENT_SECRET}`

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



app.use('/google',auth, require('./routes/googles'))

/**
 * mal api 로 넘기기전 캐시서버로 할지 api태울지 검증하는 미들웨어
 */
app.use('/mal', async(req,res,next)=>{
    const isAuth = await auth(req,res)
    if(isAuth){
        await cache(req,res,next)
    }
}, require('./routes/mals'))
app.use('/tmdb', require('./routes/tmdbs'))
app.use('/translate', require('./routes/translates'))
app.listen(port, () => console.log(`Server listening on port ${port}`))

})()

