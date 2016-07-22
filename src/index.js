// external dependencies
const bPromise = require('bluebird');
const _ = require('lodash');

// internal dependencies
const login = require('./login');
const location = require('./location');

// main functions
var fn = {

  playerInfo: {
    location: {
      latitude: null,
      longitude: null,
      value: null
    }
  },

  login: function(username, password, method) {
    var promise = bPromise.reject(new Error('Invalid login method'));
    method = method.toLowerCase();

    if (method === 'google') {
      promise = login.google;
    } else if (method === 'pokemon-club') {
      promise = login.pokemonClub;
    }

    return promise(username, password);
  },

  location: {

    set: function(/* type, value || type, latitude, longitude */) {
      var args = Array.prototype.slice.call(arguments);
      var promise = null;
      var type = args.shift().toLowerCase();

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
          fn.playerInfo.location = location;
          return location;
        });
    },

    get: function() {
      return bPromise.resolve(fn.playerInfo.location);
    }

  }

};

exports = module.exports = fn;
