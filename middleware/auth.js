const {errMsg } = require('../util/errorHandle')

module.exports = (req, res, next) => {
    try {    
      const authKey = req.headers[process.env.API_KEY];
      if (authKey !== process.env.API_KEY_VALUE) {
        throw 'not matched key';
      } else {
        return true;
      }
    } catch (e) {
      res.status(401).json(errMsg(e));
    }
  };