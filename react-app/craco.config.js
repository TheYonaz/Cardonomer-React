module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix for Mapbox GL JS worker bundle issue
      webpackConfig.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      });

      // Ignore source map warnings from mapbox-gl
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];

      return webpackConfig;
    },
  },
};

