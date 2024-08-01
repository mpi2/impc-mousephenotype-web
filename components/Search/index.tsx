import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import styles from "./styles.module.scss";
import { debounce } from "lodash";

export type Tab = {
  name: string;
  link: string;
  external?: boolean;
  type?: string;
};

const Search = ({
  defaultType = "",
  onChange,
  updateURL = false,
}: {
  defaultType?: string;
  onChange?: (val: string) => void;
  updateURL?: boolean
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

  const tabs: Tab[] = [
    {
      name: "Genes",
      link: "/data/search",
      type: undefined,
    },
    {
      name: "Phenotypes",
      link: "/data/search?type=phenotype",
      type: "phenotype",
    },
    {
      name: "Help, news, blog",
      link: `${process.env.NEXT_PUBLIC_NEWS_SEARCH}/?s=`,
      external: true,
      type: "blog",
    },
  ];
  const getSelectedIndex = (typeInput) => tabs.findIndex((tab) => tab.type === typeInput);
  const [tabIndex, setTabIndex] = useState(getSelectedIndex(defaultType));
  useEffect(() => {
    let tabType = type;
    if (type === undefined && !!defaultType) {
      tabType = defaultType;
    }
    setTabIndex(getSelectedIndex(tabType));
  }, [type, defaultType]);

  useEffect(() => {
    if (router.isReady && router.query.query) {
      setQuery(router.query.query as string);
      handleInput(router.query.query as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (updateURL) {
      if (router.isReady && router.query.query !== query) {
        router.replace({query: { ...router.query, query },});
      }
    }
  }, [query]);


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
                  <Link
                    href={tab.link}
                    key={`tab-${tab.name}`}
                    className={isActive ? styles.tab__active : styles.tab}
                  >
                    {tab.name}
                  </Link>
                );
              }
            })}
          </div>
          <div className={styles.inputCont}>
            <input
              title="main search box"
              className={styles.input}
              type="text"
              placeholder={ tabIndex === 0 ? "Search for a gene..." : "Search for a phenotype..."}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                delayedOnChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (router.route !== "/search") {
                    let url = `/data/search?query=${e.currentTarget.value}`;
                    if (tabIndex === 1) {
                      url += '&type=phenotype'
                    }
                    router.push(url);
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
              aria-describedby="svg-inline--fa-title-search-icon"
            >
              <FontAwesomeIcon icon={faSearch} title="Search button" titleId="search-icon" />
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Search;
