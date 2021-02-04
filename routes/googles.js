const router = require('express').Router();
const {errMsg , successMsg, successAndFetchData} = require('../util/errorHandle');
const {searchImage} = require('../service/googleService')

router.get('/data', async (req,res)=>{

    try {
        const query = req.query.q 
        const count = req.query.count
    
        if(query){
            const googleSearchResult = await searchImage(query,count)
            return res.status(200).send(successAndFetchData('구글 검색 성공' ,googleSearchResult))
        }else{
            console.error('구글 검색 파라미터 입력안됨.')
            return res.status(404).send(errMsg('파라미터 입력 안됨.'))
        }
    } catch (e) {
        console.error(`google search err: ${e}`)
        return res.status(404).send(errMsg(`${e}`))
    }

})

module.exports = router