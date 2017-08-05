const axios = require('axios');

class IOServer {
  constructor(io) {
    if(io === undefined) {
      return;
    }

    io.on('connection', (socket) => {
      socket.on('findnodes', (data, fn) => {
        this.getCollections(data, (result) => { fn(result); });
      });
    });
  }

  getCollections(data, fn) {
    let nodes = [{"_id":"compunit/napi_2","_key":"napi_2","_rev":"_VYOPfAa---","name":"compunit02"},
                 {"_id":"compunit/napi_5","_key":"napi_5","_rev":"_VYmsfwq---","name":"compunit05"},
                 {"_id":"compunit/napi_1","_key":"napi_1","_rev":"_VYOPIJe---","name":"compunit01"},
                 {"_id":"compunit/napi_3","_key":"napi_3","_rev":"_VYmsv6m---","name":"compunit03"},
                 {"_id":"compunit/napi_4","_key":"napi_4","_rev":"_VYms7Vm---","name":"compunit04"}];

    return fn(nodes);
  }
}

module.exports = IOServer;
