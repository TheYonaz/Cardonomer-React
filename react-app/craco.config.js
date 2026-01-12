module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix for Mapbox GL JS - exclude mapbox-gl from transpilation
      webpackConfig.module.rules = [
        ...webpackConfig.module.rules.map(rule => {
          if (rule.oneOf) {
            return {
              ...rule,
              oneOf: rule.oneOf.map(oneOfRule => {
                if (oneOfRule.test && oneOfRule.test.toString().includes('jsx')) {
                  return {
                    ...oneOfRule,
                    exclude: /node_modules\/(?!(mapbox-gl|@mapbox)\/).*/,
                  };
                }
                return oneOfRule;
              }),
            };
          }
          return rule;
        }),
      ];

      // Add specific rule for mapbox-gl workers
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

