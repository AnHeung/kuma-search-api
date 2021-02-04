const errMsg = (msg) => {
    return { err: true, msg: msg }
}

const successMsg = (msg) => {
    return { err: false, msg: msg }
}

const successAndFetchData = (msg, data) => {
    return { err: false, msg: msg || '성공', data: data }
}

module.exports = {
    errMsg: errMsg,
    successMsg: successMsg,
    successAndFetchData: successAndFetchData
}

