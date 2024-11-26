import "../styles/global.scss";

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-circular-progressbar/dist/styles.css";
import "phenogrid/dist/phenogrid-bundle.css";
import "react-loading-skeleton/dist/skeleton.css";

import { GeneComparatorProvider } from "@/components/GeneComparator";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Script from "next/script";
config.autoAddCss = false;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: (failureCount: Number, error) => {
        const is404Error = error && error.toString() === "No content";
        const hasReached3Failures = failureCount === 3;
        // need to return false to stop retrying
        return !(is404Error || hasReached3Failures);
      },
    },
  },
});
function MyApp({ Component, pageProps }) {
  const mockingEnabled =
    !!process.env.NEXT_PUBLIC_API_MOCKING &&
    process.env.NEXT_PUBLIC_API_MOCKING === "enabled";
  const [shouldRender, setShouldRender] = useState(!mockingEnabled);
  useEffect(() => {
    if (mockingEnabled) {
      import("../mocks")
        .then((fn) => fn.initMocks())
        .then(() => setShouldRender(true));
    }
  }, []);
  if (!shouldRender) {
    return <></>;
  }
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <>
        <Script>
          {` // Google Tag Manager
            (function(w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js'
                });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src =
                    'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-NZPSPWR');`}
        </Script>
        <Script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-settings-id="y7WXZ02Q6JSq6Q"
          async
        />
        <QueryClientProvider client={queryClient}>
          <GeneComparatorProvider>
            <Layout>{page}</Layout>
          </GeneComparatorProvider>
        </QueryClientProvider>
      </>
    ));
  return getLayout(<Component {...pageProps} />);
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
