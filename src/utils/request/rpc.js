// external dependencies
const bPromise = require('bluebird');
const _ = require('lodash');

// internal dependencies
const protobuf = require('../proto');
const httpRequest = require('./http')

// constants/variables
const RequestEnvelop = protobuf.RequestEnvelop;
const ResponseEnvelop = protobuf.ResponseEnvelop;

function performRequest(endpoint, requests, latitude, longitude, provider, token) {
  const envelop = new RequestEnvelop({
    unknown1: 2,
    rpc_id: 1469378659230941192,
    requests: requests,
    latitude: latitude,
    longitude: longitude,
    altitude: 0,
    auth: new RequestEnvelop.AuthInfo({
      provider: provider,
      token: new RequestEnvelop.AuthInfo.JWT(token, 59)
    }),
    unknown12: 989
  });
  const buffer = envelop.encode().toBuffer();
  const options = {
    url: endpoint,
    body: buffer,
    encoding: null,
    headers: {
      'User-Agent': 'Niantic App'
    }
  };

  return httpRequest.post(options)
    .then(function(data) {
      var responseBuffer;

      if (!data.response || !data.body) {
        return bPromise.reject(new Error('RPC Server offline'));
      }

      try {
        responseBuffer = ResponseEnvelop.decode(data.body);
      } catch (error) {
        if (error.decoded) {
          responseBuffer = error.decoded;
        }
      }

      if (!responseBuffer) {
        return performRequest(endpoint, requests, latitude, longitude, provider, token);
      }

      return responseBuffer;
    });
};

exports = module.exports = performRequest;
