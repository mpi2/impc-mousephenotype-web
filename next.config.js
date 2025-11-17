const isProd = process.env.NODE_ENV === "production";

const cspHeader = `
    default-src 'none';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.usercentrics.eu;
    style-src 'self' 'unsafe-inline';
    connect-src 'self' *.mousephenotype.org *.usercentrics.eu *.google.com *.ebi.ac.uk *.google-analytics.com *.amazonaws.com *.gentar.org ${!isProd ? "localhost:8010 localhost:5000" : ""};
    img-src 'self' blob: data: *.usercentrics.eu *.ebi.ac.uk *.amazonaws.com *.google.co.uk;
    frame-src *.usercentrics.eu;
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
  poweredByHeader: false,
};
