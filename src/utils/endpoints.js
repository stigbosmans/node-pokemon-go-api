// external dependencies
const bPromise = require('bluebird');
const _ = require('lodash');

// internal dependencies
const protobuf = require('./proto');
const apiRequest = require('./request/rpc');

// constants/variables
const RequestEnvelop = protobuf.RequestEnvelop;
const ResponseEnvelop = protobuf.ResponseEnvelop;

// constants/variables
var fn = {

  api: {

    get: function(latitude, longitude, method, token) {
      const requests = [
        new RequestEnvelop.Requests(2),
        new RequestEnvelop.Requests(126),
        new RequestEnvelop.Requests(4),
        new RequestEnvelop.Requests(129),
        new RequestEnvelop.Requests(5)
      ];
      const url = 'https://pgorelease.nianticlabs.com/plfe/rpc';

      return apiRequest(url, requests, latitude, longitude, method, token)
        .then(function(response) {
          return 'https://' + response.api_url + '/rpc';
        });
    }

  }

};

exports = module.exports = fn;
