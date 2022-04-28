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
  experimental: {
    outputStandalone: true,
  },
};
