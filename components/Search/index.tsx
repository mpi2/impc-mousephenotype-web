import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import styles from "./styles.module.scss";
import { debounce } from "lodash";
import { route } from "next/dist/server/router";

export type Tab = {
  name: string;
  link: string;
  external?: boolean;
};

const Search = ({
  isPhenotype,
  onChange,
}: {
  isPhenotype?: boolean;
  onChange?: (val: string) => void;
}) => {
  const router = useRouter();
  const [query, setQuery] = useState<string>(
    (router.query.query as string) || ""
  );

  const handleInput = (val: string) => {
    if (onChange) onChange(val);
  };

  const delayedOnChange = useRef(
    debounce((q: string) => handleInput(q), 500)
  ).current;
  const { type } = router.query;
  isPhenotype = isPhenotype ?? type === "phenotype";

  const tabs: Tab[] = [
    {
      name: "Genes",
      link: "/search",
    },
    {
      name: "Phenotypes",
      link: "/search?type=phenotype",
    },
    {
      name: "Help, news, blog",
      link: `${process.env.NEXT_PUBLIC_NEWS_SEARCH}/?s=`,
      external: true,
    },
  ];
  const [tabIndex, setTabIndex] = useState(isPhenotype ? 1 : 0);
  useEffect(() => {
    setTabIndex(isPhenotype ? 1 : 0);
  }, [type]);

  useEffect(() => {
    if (router.isReady && router.query.query) {
      setQuery(router.query.query as string);
      handleInput(router.query.query as string);
    }
  }, [router.isReady]);

  return (
    <div className={`${styles.banner}`}>
      <Container className={`pb-4 pt-5 ${styles.container}`}>
        <div className="col-12 col-md-8 ps-4 pe-4">
          <div className={styles.tabs}>
            {tabs.map((tab, i) => {
              const isActive = i === tabIndex;
              if (tab.external) {
                return (
                  <a
                    className={isActive ? styles.tab__active : styles.tab}
                    href={tab.link}
                    key={`tab-${tab.name}`}
                  >
                    {tab.name}
                  </a>
                );
              } else {
                return (
                  <Link href={tab.link} key={`tab-${tab.name}`}>
                    <a
                      className={isActive ? styles.tab__active : styles.tab}
                      href="#"
                    >
                      {tab.name}
                    </a>
                  </Link>
                );
              }
            })}
          </div>
          <div className={styles.inputCont}>
            <input
              className={styles.input}
              type="text"
              placeholder="Search All 7824 Knockout Data..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                delayedOnChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (router.route !== "/search") {
                    router.push(`/search?query=${e.currentTarget.value}`);
                  } else {
                    router.replace({
                      query: { ...router.query, query: e.currentTarget.value },
                    });
                  }
                }
              }}
            />
            <button
              className={styles.searchBtn}
              onClick={() => {
                handleInput(query);
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Search;
