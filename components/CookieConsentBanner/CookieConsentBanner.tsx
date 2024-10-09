import Link from "next/link";
import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";
import cookieCutter from "@/utils/cookie-cutter";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCookieBite } from "@fortawesome/free-solid-svg-icons";

const CookieConsentBanner = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerPresent, setBannerPresent] = useState<boolean>(true);
  const [bannerVisible, setBannerVisible] = useState<boolean>(false);
  const [bannerHeight, setBannerHeight] = useState<number>(-110);

  useEffect(() => {
    const cookie = cookieCutter.get("ccbcookie");
    console.log({ cookie });
    setBannerPresent(!cookie);
  }, []);

  const toggleVisible = () => setBannerVisible((prevState) => !prevState);

  useEffect(() => {
    if (bannerRef.current) {
      setBannerHeight(-bannerRef.current.clientHeight);
    }
  }, [bannerRef]);

  console.log(`${bannerHeight}px`);
  return (
    bannerPresent && (
      <div
        className={classNames(styles.banner, { [styles.show]: bannerVisible })}
        style={{ bottom: `${bannerHeight}px` }}
      >
        <div className="tag" onClick={toggleVisible}>
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
          <form>
            <label className={styles.checkbox}>
              <input type="checkbox" value="Essential" checked disabled />
              &nbsp;Essential
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" value="Analytics" />
              &nbsp;Analytics
            </label>
          </form>
          <div className={styles.options}>
            <button
              className={classNames("btn", styles.button)}
              aria-label="deny cookies"
              onClick={toggleVisible}
            >
              Close
            </button>
            <button
              id="saveCookies"
              className={classNames("btn", styles.button, styles.allow)}
              aria-label="allow cookies"
            >
              Save preferences
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CookieConsentBanner;
