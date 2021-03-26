
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

const getScheduleText =  (day)=>{

    switch(day){
        case '1': 
        return  "monday"
        case '2': 
        return "tuesday"    
        case '3': 
        return "wednesday"
        case '4': 
        return "thursday"
        case '5': 
        return "friday"
        case '6': 
        return  "saturday"
        case '0': 
        return "sunday"
    }
    return "monday";
}

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

const malTypeToKorea = (type)=>{

    if(isEmpty(type)) return "해당없음";

    switch(type.toLowerCase()){
        case  'airing' :
            type = "상영중"
        break;
        case  'movie' :
            type = "극장판"
        break;
        case  'ova' :
            type = type.toUpperCase()
        case  'tv' :
            type = type.toUpperCase()
        break;
        case  'upcoming' :
            type = "상영예정"
        break;
    }
    return type;
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
    getYear:getYear,
    malTypeToKorea:malTypeToKorea,
    getScheduleText:getScheduleText
}

