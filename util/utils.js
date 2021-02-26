
const makeCodeChallenge = () => {

    try {

        const randomstring = require("randomstring");
        const crypto = require("crypto");
        const base64url = require("base64url");

        const code_verifier = randomstring.generate(128);

        const base64Digest = crypto
            .createHash("sha256")
            .update(code_verifier)
            .digest("base64");

        const code_challenge = base64url.fromBase64(base64Digest);
        console.log(code_challenge);
        return code_challenge

    } catch (e) {
        console.error(`makeCodeChallenge 실패 : ${e}`)
        return ''
    }
}

const isEmpty = value => {
    if (!value || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }
}

const getYear = ()=> new Date().getFullYear()

const getSeasonText = ()=>{

    const month = new Date().getMonth();
    let monthText = "spring";
    switch(month){
        case 1 : 
        case 2 :
        case 3 :
            monthText = "winter";
            break;
        case 4 :
        case 5:
        case 6:
            monthText = "spring";
            break;
        case 7:
        case 8:
        case 9:
            monthText = "summer";
            break;
        case 10:
        case 11:
        case 12:
            monthText = "fall";
            break;
    }
    return monthText;
}

const cleanText = (text)=>{
    if(isEmpty(text) || !isEmpty(text) && typeof text !== 'string') return ''
    return text.replace(/([\t|\n])/gi, "").toString().trim()
}



module.exports = {
    makeCodeChallenge: makeCodeChallenge,
    cleanText: cleanText,
    isEmpty:isEmpty,
    getSeasonText:getSeasonText,
    getYear:getYear
}

