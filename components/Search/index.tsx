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
};

const Search = ({
  isPhenotype,
  onChange,
}: {
  isPhenotype?: boolean;
  onChange?: (val: string) => void;
}) => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const delayedOnChange = useRef(
    debounce((q: string) => onChange(q), 500)
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
              onChange={(e) => {
                setQuery(e.target.value);
                delayedOnChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onChange(query);
                }
              }}
            />
            <button
              className={styles.searchBtn}
              onClick={() => {
                onChange(query);
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
