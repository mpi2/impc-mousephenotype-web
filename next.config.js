const isProd = process.env.NODE_ENV === 'production'
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
    ];
  },
  async headers() {
    return [
      {
        // Append the "Service-Worker-Allowed" header
        // to each response, overriding the default worker's scope.
        source: '/(.*)',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
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
    locales: ['en'],
    defaultLocale: 'en',
  }
};
