const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
const nwConfig = withNativeWind(config, {
  input: './global.css',
  inlineRem: 16,
});

nwConfig.transformer = {
  ...nwConfig.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
nwConfig.resolver = {
  ...nwConfig.resolver,
  assetExts: nwConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...nwConfig.resolver.sourceExts, 'svg'],
};

module.exports = nwConfig;
