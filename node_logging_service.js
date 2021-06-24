global.window = {};

const axios = require('axios');
const JSEncrypt = require('jsencrypt')
const CryptoJS = require("crypto-js");
const Logger = require("./node_core_logger");

module.exports = (message) => {

    message = signMessage(message);

    console.log(message)

    axios.post(process.env.LOGSERVER_URL, message)
      .then((res) => {      
        Logger.log('[SeeChange - Logging] Log created', res);
      }, (error) => {
        Logger.error('[SeeChange - Logging] Log error', error);
      });
}

function signMessage(message) {
    const sign = new JSEncrypt();
    sign.setPrivateKey(process.env.PRIVATE_KEY);
    
    const timestamp = Date.now();
    const signature = sign.sign(message + timestamp, CryptoJS.SHA256, "sha256");

    const messageWithSignature = {
        message: message,
        signature: signature,
        timestamp: timestamp,
    };

    return messageWithSignature;
}