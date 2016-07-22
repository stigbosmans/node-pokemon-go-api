// external dependencies
const bPromise = require('bluebird');
const _ = require('lodash');

// internal dependencies
const login = require('./login');
const location = require('./location');

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

  profile: {

    get: function() {
      return require('./requests/get-profile')(fn.cache.playerEndpoint,
        fn.cache.location.latitude, fn.cache.location.longitude,
        fn.cache.provider, fn.cache.token);
    }

  },

  inventory: {

    get: function() {
      return require('./requests/get-inventory')(fn.cache.playerEndpoint,
        fn.cache.location.latitude, fn.cache.location.longitude,
        fn.cache.provider, fn.cache.token);
    }

  },

  getPlayerEndpoint: function() {
    const request = require('./requests/get-player-endpoint')(fn.cache.location.latitude,
      fn.cache.location.longitude, fn.cache.provider, fn.cache.token);

    return request
      .then(function(playerEndpoint) {
        fn.cache.playerEndpoint = playerEndpoint;
        return playerEndpoint;
      });
  }

};

exports = module.exports = fn;
