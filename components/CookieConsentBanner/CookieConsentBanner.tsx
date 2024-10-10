import Link from "next/link";
import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";
import cookieCutter from "@/utils/cookie-cutter";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCookieBite } from "@fortawesome/free-solid-svg-icons";

export const GOOGLE_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || "";

const gtag: Gtag.Gtag = function () {
  (window as any).dataLayer.push(arguments);
};

// Follows GA basic consent mode
// https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic

const CookieConsentBanner = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerVisible, setBannerVisible] = useState<boolean>(false);
  const [bannerHeight, setBannerHeight] = useState<number>(-110);

  const loadGtagJsScript = () => {
    gtag("consent", "update", {
      ad_user_data: "granted",
      ad_personalization: "granted",
      ad_storage: "granted",
      analytics_storage: "granted",
    });
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(gtagScript, firstScript);
  };

  const toggleBannerVisible = () => setBannerVisible((prevState) => !prevState);

  const updateCookies = () => {
    toggleBannerVisible();
    const optInValues = [
      ...document.querySelectorAll("#cookieValues input:checked"),
    ].map((el: any) => el.value);
    cookieCutter.set("ccbcookie", optInValues.join(","), {
      expires: 4320000000,
      path: "/",
    });
    if (optInValues.includes("Analytics")) {
      loadGtagJsScript();
    }
  };

  useEffect(() => {
    const cookie = cookieCutter.get("ccbcookie");
    if (!cookie) {
      toggleBannerVisible();
    }
    (window as any).dataLayer = (window as any).dataLayer || [];
    gtag("consent", "default", {
      ad_user_data: "denied",
      ad_personalization: "denied",
      ad_storage: "denied",
      analytics_storage: "denied",
      wait_for_update: 500,
    });
    gtag("js", new Date());
    gtag("config", GOOGLE_TAG_ID);
    if (cookie && cookie.includes("Analytics")) {
      (
        document.querySelector("#analyticsCheckbox") as HTMLInputElement
      ).checked = true;
      loadGtagJsScript();
    }
  }, []);

  useEffect(() => {
    if (bannerRef.current) {
      setBannerHeight(-bannerRef.current.clientHeight);
    }
  }, [bannerRef]);

  return (
    <div
      className={classNames(styles.banner, { [styles.show]: bannerVisible })}
      style={{ bottom: `${bannerHeight}px` }}
    >
      <div className="tag" onClick={toggleBannerVisible}>
        <span className={styles.iconWrapper}>
          <FontAwesomeIcon icon={faCookieBite} />
        </span>
      </div>
      <div
        className={styles.body}
        role="dialog"
        aria-label="cookieconsent"
        aria-live="polite"
        aria-describedby="cookieconsent"
        ref={bannerRef}
      >
        <span>
          This site uses cookies. Some of them are essentials while other help
          us improve your experience.&nbsp;
          <Link
            href="/about-impc/accessibility-cookies/"
            className="primary link"
            aria-label="learn more about cookies"
            role="button"
          >
            Learn more
          </Link>
        </span>
        <form id="cookieValues">
          <label className={styles.checkbox}>
            <input type="checkbox" value="Essential" checked disabled />
            &nbsp;Essential
          </label>
          <label className={styles.checkbox}>
            <input id="analyticsCheckbox" type="checkbox" value="Analytics" />
            &nbsp;Analytics
          </label>
        </form>
        <div className={styles.options}>
          <button
            className={classNames("btn", styles.button)}
            aria-label="deny cookies"
            onClick={toggleBannerVisible}
          >
            Close
          </button>
          <button
            id="saveCookies"
            className={classNames("btn", styles.button, styles.allow)}
            aria-label="allow cookies"
            onClick={updateCookies}
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
