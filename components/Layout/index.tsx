import Footer from "../Footer";
import Header from "../Header";
import Newsletter from "../Newsletter";
import Head from "next/head";
import CookieConsentBanner from "../CookieConsentBanner";

const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <link rel="shortcut icon" href="/data/favicon.ico" />
      </Head>
      <Header />
      <main>{children}</main>
      <Newsletter />
      <Footer />
      <CookieConsentBanner />
    </div>
  );
};

export default Layout;
