module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Critical fix: Exclude mapbox-gl from ALL babel transpilation
      const babelLoaderRule = webpackConfig.module.rules.find(rule => rule.oneOf);
      
      if (babelLoaderRule && babelLoaderRule.oneOf) {
        babelLoaderRule.oneOf.forEach(rule => {
          if (rule.loader && rule.loader.includes('babel-loader')) {
            // Exclude mapbox-gl and its dependencies from babel transpilation
            rule.exclude = [
              /node_modules\/mapbox-gl/,
              /node_modules\/@mapbox/,
              rule.exclude
            ].filter(Boolean);
          }
        });
      }

      // Ensure mapbox-gl workers aren't processed
      webpackConfig.module.rules.push({
        test: /\.js$/,
        include: /node_modules\/mapbox-gl/,
        use: ['source-map-loader'],
        enforce: 'pre'
      });

      // Add resolve configuration for mapbox-gl
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        alias: {
          ...webpackConfig.resolve.alias,
          // Ensure we use the dist version which has pre-built workers
          'mapbox-gl': 'mapbox-gl/dist/mapbox-gl.js'
        }
      };

      // Ignore source map warnings and worker warnings
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /Critical dependency: the request of a dependency is an expression/
      ];

      return webpackConfig;
    },
  },
};

