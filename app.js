const NodeMediaServer = require('./');
const dotenv = require('dotenv').config();
const logError = require('./node_logging_service');

const io = require("socket.io-client");
const JSEncrypt = require("jsencrypt/bin/jsencrypt");
const CryptoJS = require("crypto-js");
var connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
const socket = io('ws://localhost:3001');

const config = {
  rtmp: {
    port: process.env.RTMP_PORT,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: process.env.HTTP_PORT,
    mediaroot: './media',
    webroot: './www',
    allow_origin: '*',
    api: true
  },
  auth: {
    api: false,
    api_user: 'admin',
    api_pass: 'admin',
    play: false,
    publish: false,
    secret: 'nodemedia2017privatekey'
  }
};


let nms = new NodeMediaServer(config)
nms.run();

nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
  //establishConnection();
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  logError(`[STREAM] Stream with stream path: ${StreamPath}, has started`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  logError(`[STREAM] Stream with stream path: ${StreamPath}, has ended`);

  //Emit
  sendRatingToServer(StreamPath);
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

/*function establishConnection() {
  var connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  console.log("Connection setup!");

  socket = io('ws://localhost:3001', connectionOptions);
  console.log("is connected? " + socket.connected);
}*/

function sendRatingToServer(StreamPath) {
  console.log("Disconnected!!!" + StreamPath);
  console.log("is connected? " + socket.connected);
  socket.emit("streamDisconnected", signRating("", StreamPath));
}

function signRating(rating, stream){
  const ok = { };
  return ok;
  const sign = new JSEncrypt();
  //sign.setPrivateKey(stream.private_key);
  const timestamp = Date.now();
  //const signature = sign.sign(rating + timestamp, CryptoJS.SHA256, "sha256");

  const ratingWithSig = {
    mark: rating,
    username: stream.username,
    //stream: stream.streamKey,
    //signature: signature,
    timestamp: timestamp,
  };

  return ratingWithSig;
}


