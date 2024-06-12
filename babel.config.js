module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset'],
    // plugins: [
    //   // a linha abaixo tem que estar por último.
    //   'react-native-reanimated/plugin',
    // ],
  };
};
