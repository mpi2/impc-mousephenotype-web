const isProd = process.env.NODE_ENV === "production";

const cspHeader = `
    default-src 'self' mousephenotype.org *.mousephenotype.org *.usercentrics.eu *.amazonaws.com *.gentar.org *.ebi.ac.uk *.google.com *.doubleclick.net *.google-analytics.com ${!isProd ? "localhost:8010" : ""};
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.usercentrics.eu;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: *.usercentrics.eu *.ebi.ac.uk *.amazonaws.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

module.exports = {
  basePath: "/data",
  //uncomment the following line when deploying with vercel
  // swcMinify: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), payment=(), geolocation=()",
          },
        ],
      },
    ];
  },
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
