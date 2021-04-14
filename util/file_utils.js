const fs = require('fs');
const defaultPath = './mal_config.json';

const getMalConfig = async ()=>{
    try {
        if(await isFileExist()){
            const json = fs.readFileSync(defaultPath , 'utf-8')
            if(json) return JSON.parse(json)
            return {};
        }
        return {}
    } catch (e) {
        console.error(`getMalConfig error :${e}`);
        return {}
    }
}

const updateMalConfig = async(config)=>{

    return new Promise(res=>{
        fs.writeFile(defaultPath , JSON.stringify(config), e=>{
            if(e){
                throw new Error('updateMalConfig 실패')
            }
            console.log('updateMalConfig 성공')
            res()
        })
    })

}

const isFileExist = ()=>
    new Promise((res)=>{
        fs.stat(defaultPath , e=>{
            if(e) return res(false)
            res(true)
        })
})

module.exports={
    isFileExist : isFileExist,
    getMalConfig :getMalConfig ,
    updateMalConfig:updateMalConfig
}