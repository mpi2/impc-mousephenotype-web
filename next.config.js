const isProd = process.env.NODE_ENV === "production";
module.exports = {
  basePath: "/data",
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
};
