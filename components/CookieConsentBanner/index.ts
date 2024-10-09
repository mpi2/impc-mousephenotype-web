import dynamic from "next/dynamic";

export default dynamic(() => import("./CookieConsentBanner"), {
  ssr: false,
});
