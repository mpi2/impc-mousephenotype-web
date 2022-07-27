module.exports = {
  //uncomment the following line when deploying with vercel
  // swcMinify: false,
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/search",
  //       permanent: false,
  //     },
  //   ];
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
