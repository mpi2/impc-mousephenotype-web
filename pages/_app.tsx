import "../styles/global.scss";

import {useEffect, useState} from "react";
import Layout from "../components/Layout";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-circular-progressbar/dist/styles.css";
import "phenogrid/dist/phenogrid-bundle.css";
import { SSRProvider } from "react-bootstrap";

import { GeneComparatorProvider } from "../components/GeneComparator";
config.autoAddCss = false;
function MyApp({ Component, pageProps }) {
  const mockingEnabled = !!process.env.NEXT_PUBLIC_API_MOCKING;
  const [shouldRender, setShouldRender] = useState(!mockingEnabled);
  useEffect(() => {
    if(mockingEnabled) {
      import("../mocks")
          .then(fn => fn.initMocks())
          .then(() => setShouldRender(true));
    }
  }, []);
  if (!shouldRender) {
      return <></>;
  }
  return (
    <SSRProvider>
      <GeneComparatorProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GeneComparatorProvider>
    </SSRProvider>
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
