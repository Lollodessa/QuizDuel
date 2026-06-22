const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Manually resolve Firebase packages to their correct builds
// instead of using unstable_enablePackageExports (which causes esm2017 issues)
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@firebase/auth') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/@firebase/auth/dist/rn/index.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === '@firebase/util') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/@firebase/util/dist/index.cjs.js'),
      type: 'sourceFile',
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
