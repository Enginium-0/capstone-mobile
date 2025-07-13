// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  'react-native-web': require.resolve('react-native-web')
};

module.exports = config;
