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
  cacheHandler: require.resolve(
    "next/dist/server/lib/incremental-cache/file-system-cache.js",
  ),
  poweredByHeader: false,
};
