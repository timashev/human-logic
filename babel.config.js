module.exports = function(api) {
  api.cache.forever();

  const presets = ['@babel/preset-typescript'];
  const plugins = ['@babel/plugin-proposal-class-properties'];

  const env = {
    test: {
      presets: ['@babel/preset-env', ...presets],
      plugins
    }
  };

  return { presets, plugins, env };
};
