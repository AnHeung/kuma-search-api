const errMsg = (msg) => {
    return { err: true, msg }
}

const successMsg = (msg) => {
    return { err: false, msg }
}

const successAndFetchData = (msg, result) => {
    return { err: false, msg: msg || '성공', result }
}

module.exports = {
    errMsg: errMsg,
    successMsg: successMsg,
    successAndFetchData: successAndFetchData
}

