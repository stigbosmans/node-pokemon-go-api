// external dependencies
const protobuf = require('protobufjs');
const path = require('path');

// constants/variables
const loadedProtobuf = protobuf.loadProtoFile(path.join(__dirname,
  '../assets/pokemon.proto'));

exports = module.exports = loadedProtobuf.build();
