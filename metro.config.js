const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Garantir que Fast Refresh está habilitado
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return middleware;
  },
};

// Configurações para melhorar o hot reload
config.watchFolders = [__dirname];
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), 'css'],
};
 
module.exports = withNativeWind(config, { input: './global.css' })