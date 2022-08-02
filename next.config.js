const webpack = require("webpack");
module.exports = {
  //uncomment the following line when deploying with vercel
  // swcMinify: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/search",
        permanent: false,
      },
    ];
  },
  // webpack: (config) => {
  //   config.plugins.push(
  //     new webpack.ProvidePlugin({
  //       $: "jquery",
  //       jQuery: "jquery",
  //     })
  //   );
  //   return config;
  // },
  experimental: {
    outputStandalone: true,
  },

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
