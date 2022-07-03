// import App from 'next/app'
import "../styles/global.scss";

import Layout from "../components/Layout";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-circular-progressbar/dist/styles.css";
import "phenogrid/dist/phenogrid-bundle.css";
import { SSRProvider } from "react-bootstrap";
import Script from "next/script";
config.autoAddCss = false;

console.log("test:", process.env.NEXT_PUBLIC_API_MOCKING);
if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  console.log("requiring mocks");
  require("../mocks");
}

function MyApp({ Component, pageProps }) {
  console.log("env in app:", process.env.NEXT_PUBLIC_API_MOCKING);
  return (
    <SSRProvider>
      <Layout>
        <Script src="/phenogrid.js" />
        <Component {...pageProps} />
      </Layout>
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
