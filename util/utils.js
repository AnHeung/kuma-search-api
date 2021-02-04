
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

module.exports = {
    makeCodeChallenge:makeCodeChallenge
}

