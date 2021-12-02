const moment = require('moment');


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

const getYear = () => new Date().getFullYear()

const getScheduleText = (day) => {

    switch (day) {
        case '1':
            return "monday"
        case '2':
            return "tuesday"
        case '3':
            return "wednesday"
        case '4':
            return "thursday"
        case '5':
            return "friday"
        case '6':
            return "saturday"
        case '0':
            return "sunday"
    }
    return "monday";
}

const getSeasonText = () => {

    const month = new Date().getMonth();
    let monthText = "spring";
    switch (month) {
        case 1:
        case 2:
        case 3:
            monthText = "winter";
            break;
        case 4:
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

const malTypeToKorea = (type) => {

    if (isEmpty(type)) return "해당없음";

    switch (type.toLowerCase()) {
        case 'airing':
            type = "상영중"
            break;
        case 'movie':
            type = "극장판"
            break;
        case 'ova':
            type = type.toUpperCase()
        case 'tv':
            type = type.toUpperCase()
            break;
        case 'upcoming':
            type = "상영예정"
            break;
    }
    return type;
}

const getToday = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (1 + date.getMonth())).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}


const cleanText = (text) => {
    if (isEmpty(text) || !isEmpty(text) && typeof text !== 'string') return ''
    return text.replace(/(\\n)/g, "").toString().trim()
}

const dateToFormat = (date) => {
    if (!date) return "정보없음"
    const format = "yyyy-MM-DD"
    const formatDate = moment(date).format(format) || "정보없음"
    return formatDate
}

const getFourYearData = () => {
    const currentYear = moment().year();
    const yearArr = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];
    const format = "yyyy-MM-DD"

    return yearArr.map(year => {
        if (year === currentYear) {
            return { category: year.toString(), categoryValue: `${moment(year.toString()).format(format)}~${moment().format(format)}}` }
        } else {
            return { category: year.toString(), categoryValue: `${moment(year.toString()).format(format)}~${year}-12-31` }
        }
    })
}

const isTwoDayPassed = (date) => {
    try {
        const updateDate = moment(dateToFormat(date))
        const today = moment(getToday())
        const passDays = moment.duration(today.diff(updateDate)).asDays()
        return passDays > 1
    } catch (e) {
        console.error(`isTwoDayPassed error :${e}`)
        return false
    }
}

const appendImageText = (image_url) => {
    let image = ""

    if (image_url && image_url.length > 0) {
        const imgSplit = image_url.split('.')
        const changeIdx = imgSplit.length - 2
        const lastIdx = imgSplit.length - 1

        imgSplit.forEach((data, idx) => {
            if (idx === changeIdx) {
                image += `${data}l.`
            } else if (idx === lastIdx) {
                image += data
            } else {
                image += `${data}.`
            }
        });
    }
    return image
}
const genreList = [
    { category: "액션", categoryValue: "1" },
    { category: "어드벤쳐", categoryValue: "2" },
    { category: "자동차", categoryValue: "3" },
    { category: "코미디", categoryValue: "4" },
    { category: "Dementia", categoryValue: "5" },
    { category: "악마", categoryValue: "6" },
    { category: "미스테리", categoryValue: "7" },
    { category: "드라마", categoryValue: "8" },
    { category: "변태", categoryValue: "9" },
    { category: "판타지", categoryValue: "10" },
    { category: "게임", categoryValue: "11" },
    // { category: "HENTAI", categoryValue: "12" },
    { category: "역사", categoryValue: "13" },
    { category: "호러", categoryValue: "14" },
    { category: "아동용", categoryValue: "15" },
    { category: "마법", categoryValue: "16" },
    { category: "격투기", categoryValue: "17" },
    { category: "메카", categoryValue: "18" },
    { category: "음악", categoryValue: "19" },
    { category: "패러디", categoryValue: "20" },
    { category: "사무라이", categoryValue: "21" },
    { category: "로맨스", categoryValue: "22" },
    { category: "학교", categoryValue: "23" },
    { category: "공상과학", categoryValue: "24" },
    { category: "우주", categoryValue: "29" },
    { category: "스포츠", categoryValue: "30" },
    { category: "초인물", categoryValue: "31" },
    { category: "뱀파이어", categoryValue: "32" },
    { category: "야오이", categoryValue: "33" },
    { category: "YURI", categoryValue: "34" },
    { category: "하렘", categoryValue: "35" },
    { category: "일상물", categoryValue: "36" },
    { category: "초능력", categoryValue: "37" },
    { category: "밀리터리", categoryValue: "38" },
    { category: "경찰", categoryValue: "39" },
    { category: "심리물", categoryValue: "40" },
    { category: "스릴러", categoryValue: "41" },
    { category: "동인", categoryValue: "43" },
]

const genreEnglishToKorea = (genreValue) => {

    switch (genreValue) {
        case "1": return "액션"
        case "2": return "어드벤쳐"
        case "3": return "자동차"
        case "4": return "코미디"
        case "5": return "Dementia"
        case "6": return "악마"
        case "7": return "미스테리"
        case "8": return "드라마"
        case "9": return "엣찌"
        case "10": return "판타지"
        case "11": return "게임"
        case "12": return "HENTAI"
        case "13": return "역사"
        case "14": return "호러"
        case "15": return "아동용"
        case "16": return "마법"
        case "17": return "격투기"
        case "18": return "메카"
        case "19": return "음악"
        case "20": return "패러디"
        case "21": return "사무라이"
        case "22": return "로맨스"
        case "23": return "학교"
        case "24": return "공상과학"
        case "29": return "우주"
        case "30": return "스포츠"
        case "31": return "초인물"
        case "32": return "뱀파이어"
        case "33": return "야오이"
        case "34": return "YURI"
        case "35": return "하렘"
        case "36": return "일상물"
        case "37": return "초능력"
        case "38": return "미스테리"
        case "39": return "경찰"
        case "40": return "심리물"
        case "41": return "스릴러"
        case "43": return "동인"
        default: return "";
    }
}



module.exports = {
    makeCodeChallenge: makeCodeChallenge,
    cleanText: cleanText,
    isEmpty: isEmpty,
    getSeasonText: getSeasonText,
    getYear: getYear,
    malTypeToKorea: malTypeToKorea,
    getScheduleText: getScheduleText,
    getToday: getToday,
    appendImageText: appendImageText,
    getFourYearData: getFourYearData,
    dateToFormat: dateToFormat,
    genreList: genreList,
    genreEnglishToKorea: genreEnglishToKorea,
    isTwoDayPassed: isTwoDayPassed
}