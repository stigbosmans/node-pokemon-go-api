// external dependencies
const bPromise = require('bluebird');
const _ = require('lodash');

// internal dependencies
const login = require('./login');
const location = require('./location');
const protobuf = require('./utils/proto');
const rpcRequest = require('./utils/request/rpc');

// constants/variables
const RequestEnvelop = protobuf.RequestEnvelop;
const ResponseEnvelop = protobuf.ResponseEnvelop;

// main functions
var fn = {

  cache: {
    location: {
      latitude: null,
      longitude: null,
      value: null
    },
    token: null,
    provider: null,
    endpoint: null
  },

  player: {
    username: null,
    team: null,
    avatar: {
      skin: null,
      hair: null,
      tshirt: null,
      trousers: null,
      cap: null,
      boots: null,
      gender: null,
      eyes: null,
      backpack: null
    },
    storage: {
      pokemon: null,
      items: null
    },
    currency: {
      pokecoin: null,
      stardust: null
    }
  },

  login: function(username, password, provider) {
    var promise;
    provider = provider.toLowerCase();

    if (provider === 'google') {
      promise = login.google;
    } else if (provider === 'pokemon-club') {
      promise = login.pokemonClub;
    }

    if (!promise) {
      return bPromise.reject(new Error('Invalid login provider'));
    }

    return promise(username, password)
      .then(function(token) {
        fn.cache.provider = provider;
        fn.cache.token = token;

        return token;
      });
  },

  location: {

    set: function(/* type, value || type, latitude, longitude */) {
      var args = Array.prototype.slice.call(arguments);
      var type = args.shift().toLowerCase();
      var promise;

      if (type === 'address') {
        promise = location.coordinates.getByAddress(args.shift());
      } else if (type === 'coordinates') {
        promise = location.address.getByCoordinates(args.shift(), args.shift());
      }

      if (!promise) {
        return bPromise.reject(new Error('Invalid location type'));
      }

      return promise
        .then(function(location) {
          fn.cache.location = location;
          return location;
        });
    },

    get: function() {
      return bPromise.resolve(fn.cache.location);
    }

  },

  inventory: {

    get: function() {
      const endpoint = fn.cache.playerEndpoint;
      const requests = new RequestEnvelop.Requests(4);

      return fn.apiRequest(endpoint, requests)
        .then(function(response) {
          const inventory = ResponseEnvelop.GetInventoryResponse
            .decode(response.payload[0]);

          return inventory;
        });
    }

  },

  profile: {

    get: function() {
      const endpoint = fn.cache.playerEndpoint;
      const requests = new RequestEnvelop.Requests(2);

      return fn.apiRequest(endpoint, requests)
        .then(function(response) {
          const profile = ResponseEnvelop.ProfilePayload.decode(response
            .payload[0]).profile;

          function extractCurrency(type) {
            const currencies = profile.currency;
            var i = 0;
            var len = currencies.length;

            type = type.toLowerCase();

            for (i; i < len; i++) {
              if (currencies[i].type.toLowerCase() === type) {
                return currencies[i].amount;
              }
            }

            return null;
          }

          fn.player.username = profile.username;
          fn.player.team = profile.team;
          fn.player.avatar = profile.avatar;
          fn.player.storage.pokemon = profile.poke_storage;
          fn.player.storage.items = profile.item_storage;
          fn.player.currency.pokecoin = extractCurrency('pokecoin');
          fn.player.currency.stardust = extractCurrency('stardust');

          return fn.player;
        });
    }

  },

  getPlayerEndpoint: function() {
    const endpoint = 'https://pgorelease.nianticlabs.com/plfe/rpc';
    const requests = [
      new RequestEnvelop.Requests(2),
      new RequestEnvelop.Requests(126),
      new RequestEnvelop.Requests(4),
      new RequestEnvelop.Requests(129),
      new RequestEnvelop.Requests(5)
    ];

    return fn.apiRequest(endpoint, requests)
      .then(function(response) {
        const playerEndpoint = 'https://' + response.api_url + '/rpc';
        fn.cache.playerEndpoint = playerEndpoint;

        return playerEndpoint;
      });
  },

  apiRequest: function(endpoint, requests) {
    const latitude = fn.cache.location.latitude;
    const longitude = fn.cache.location.longitude;
    const provider = fn.cache.provider;
    const token = fn.cache.token;

    return rpcRequest(endpoint, requests, latitude, longitude, provider, token);
  }

};

exports = module.exports = fn;
