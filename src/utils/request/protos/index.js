// external dependencies
const _ = require('lodash');
const protobuf = require('protobufjs');
const path = require('path');

// constants/variables
const localFile = _.partial(path.join.bind(path), __dirname);
const protos = {
  RequestEnvelope: {file: './request.proto', name: 'RequestEnvelope'},
  ResponseEnvelope: {file: './response.proto', name: 'ResponseEnvelope'},
  Enums: {file: './enums.proto'},
  ProfileResponse: {file: './responses/profile.proto', name: 'ProfileResponse'},
  InventoryResponse: {file: './responses/inventory.proto', name: 'InventoryResponse'}
};

// build all of the protos now
var builtProtos = {};
var protoFile;
var protoEntry;

_.each(_.keys(protos), function(protoName) {
  protoEntry = protos[protoName];
  protoFile = protobuf.loadProtoFile(localFile(protoEntry.file));
  builtProtos[protoName] = protoFile.build();

  if (protoEntry.name) {
    builtProtos[protoName] = builtProtos[protoName][protoEntry.name];
  }
});

exports = module.exports = builtProtos;
