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
config.autoAddCss = false;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: (_, error) => !(error && error.toString() === "No content"),
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
  return (
    <QueryClientProvider client={queryClient}>
      <GeneComparatorProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GeneComparatorProvider>
    </QueryClientProvider>
  );
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
