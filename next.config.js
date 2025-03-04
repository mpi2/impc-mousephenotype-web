const isProd = process.env.NODE_ENV === "production";
module.exports = {
  basePath: "/data",
  //uncomment the following line when deploying with vercel
  // swcMinify: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/data",
        permanent: true,
        basePath: false,
      },
      {
        source: "/",
        destination: "/search",
        permanent: true,
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
  // experimental: {
  //   outputStandalone: true,
  // },
  output: "standalone",

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@nivo"],
  experimental: { esmExternals: "loose" },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  cacheHandler: require.resolve(
    "next/dist/server/lib/incremental-cache/file-system-cache.js",
  ),
};
