const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  // Add externals for SystemJS to resolve
  if (!singleSpaWebpackConfig.externals) {
    singleSpaWebpackConfig.externals = {};
  }
  
  singleSpaWebpackConfig.externals = {
    ...singleSpaWebpackConfig.externals,
    'zone.js': 'zone.js'
  };

  // Set the output filename to angularapp.js
  singleSpaWebpackConfig.output = {
    ...singleSpaWebpackConfig.output,
    filename: 'angularapp.js'
  };
  
  return singleSpaWebpackConfig;
};
