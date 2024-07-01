import { useState } from "react";
import headerCss from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { Collapse } from "react-bootstrap";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface MenuItem {
  name: string;
  link: string;
  id?: number;
  classes?: string;
  sort?: number;
  children?: MenuItem[];
}

export interface INavBarProps {
  menuItems: MenuItem[];
}

const rewriteMenu = (data) => {
  return data.map(item => {
    return {
      ...item,
      link: getInternalLink(item.name, item.link),
      children: item.children && item.children.length > 0 ? rewriteMenu(item.children) : [],
    }
  })
}
const getInternalLink = (name: string, link: string) => {
  switch (name) {
    case 'Cardiovascular':
      return '/cardiovascular';
    case 'Embryo Development':
      return '/embryo';
    case 'Papers Using IMPC Resources':
      return '/publications';
    case 'Histopathology':
      return '/histopath';
    case 'Sexual Dimorphism':
      return '/sexual-dimorphism';
    case 'Genes Critical for Hearing Identified':
      return '/hearing';
    case 'Genetic Basis for Metabolic Diseases':
      return '/metabolism';
    case 'Essential Genes - Translating to Other Species':
      return '/conservation';
    case 'Batch query':
      return '/batch-query';
    default:
      return link;
  }
}

const Header = () => {
  const { data: menuItems } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const response = await fetch("https://www.mousephenotype.org/jsonmenu/");
      return await response.json();
    },
    placeholderData: [],
    // TODO: to be removed after site is launched to production
    select: rewriteMenu,
  });
  const [activeMenuId, setActiveMenu] = useState(-1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={headerCss.header}>
      <div className="header__nav-top d-none d-lg-block">
        <div className="container text-right">
          <div className="row">
            <div className="col">
              <div className="menu-top-nav-container">
                <ul id="menu-top-nav" className="menu">
                  <li className="menu-item">
                    <a href="//www.mousephenotype.org/help/">Help</a>
                  </li>
                  <li className="menu-item">
                    <a href="https://cloud.mousephenotype.org">IMPC Cloud</a>
                  </li>
                  <li className="menu-item">
                    <a href="//www.mousephenotype.org/contact-us/">
                      Contact us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="header__nav">
          <div className="container">
            <div className="row">
              <div
                className="col-6 col-md-3"
                style={{ display: "flex", alignItems: "center" }}
              >
                <a
                  href={process.env.REACT_APP_BASE_URL}
                  className="header__logo-link active"
                >
                  <img
                    className="header__logo"
                    src="/logo.svg"
                    alt="International Mouse Phenotyping Consortium Office Logo"
                    width={355}
                    height={105}
                  />
                </a>
              </div>
              <div className="col-6 col-md-9 text-right">
                <div className="d-none d-lg-block">
                  <div className="menu-main-nav-container">
                    <ul id="menu-main-nav" className="menu">
                      {menuItems.map((menuItem, i) => {
                        return (
                          <li
                            key={`menu-item-${menuItem.id}-${i}`}
                            id={`menu-item-${menuItem.id}`}
                            className={`${
                              menuItem.classes
                            } menu-item menu-item-type-post_type menu-item-object-page menu-item-${
                              menuItem.id
                            } ${
                              menuItem.classes === "data"
                                ? "current-menu-item"
                                : ""
                            }`}
                            onMouseOver={() => setActiveMenu(menuItem.id || -1)}
                            onFocus={() => setActiveMenu(menuItem.id || -1)}
                            onMouseLeave={() => setActiveMenu(-1)}
                          >
                            <a href={menuItem.link}>{menuItem.name}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <button
                  className="navbar-toggler d-inline d-lg-none collapsed"
                  type="button"
                  aria-controls="navbarToggleExternalContent"
                  aria-label="Toggle navigation"
                  onClick={() => setMobileMenuOpen(prevState => !prevState)}
                >
                  <span className="icon-bar top-bar"></span>
                  <span className="icon-bar middle-bar"></span>
                  <span className="icon-bar bottom-bar"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {menuItems
          .filter(
            (menuItem) => menuItem.children && menuItem.children.length > 0
          )
          .map((menuItem, i) => {
            const itemId = `${menuItem.classes?.split("-")[0]}-menu`;
            return (
              <div
                key={`subMenu-${menuItem.id}-${i}`}
                className={`${itemId} sub-menu d-none d-lg-block ${
                  activeMenuId == menuItem.id ? "active" : "collapse"
                }`}
                id={itemId}
                onMouseOver={() => setActiveMenu(menuItem.id || -1)}
                onFocus={() => setActiveMenu(menuItem.id || -1)}
                onMouseLeave={() => setActiveMenu(-1)}
              >
                <div className={`${itemId}__inside sub-menu__inside`}>
                  <div className="container">
                    <div className="row justify-content-end">
                      {menuItem.classes == "about-impc" ? (
                        <div className="col col-auto text-left">
                          <a key={menuItem.link} href={menuItem.link}>
                            {menuItem.name}
                          </a>
                        </div>
                      ) : null}
                      {menuItem.children?.some(
                        (item) => item.children && item.children?.length > 0
                      ) ? (
                        <>
                          {menuItem.children
                            ?.sort((a, b) => a.sort - b.sort)
                            .map((subMenuItem) => {
                              return (
                                <div
                                  key={subMenuItem.link}
                                  className="col col-auto text-left"
                                >
                                  <a href={subMenuItem.link}>
                                    {subMenuItem.name}
                                  </a>
                                  <div className="sub-pages">
                                    {subMenuItem.children
                                      ?.sort((a, b) => {
                                        if (a.name < b.name) {
                                          return -1;
                                        }
                                        if (a.name > b.name) {
                                          return 1;
                                        }
                                        return 0;
                                      })
                                      .map((subMenutItemChild) => {
                                        return (
                                          <p key={subMenutItemChild.link}>
                                            <a href={subMenutItemChild.link}>
                                              {subMenutItemChild.name}
                                            </a>
                                          </p>
                                        );
                                      })}
                                  </div>
                                </div>
                              );
                            })}
                        </>
                      ) : (
                        <>
                          {menuItem.children
                            ?.sort((a, b) => a.sort - b.sort)
                            .map((subMenuItem) => {
                              return (
                                <div
                                  key={subMenuItem.link}
                                  className="col col-auto text-left"
                                >
                                  <a href={subMenuItem.link}>
                                    {subMenuItem.name}
                                  </a>
                                </div>
                              );
                            })}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`${itemId}__drop`}></div>
              </div>
            );
          })}
      </div>
      <Collapse in={mobileMenuOpen}>
        <div className="mobile-nav" id="navbarToggleExternalContent">
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarToggleExternalContent"
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen(prevState => !prevState)}
          >
            <span className="icon-bar top-bar"></span>
            <span className="icon-bar middle-bar"></span>
            <span className="icon-bar bottom-bar"></span>
          </button>
          <div className="mobile-nav__search mb-3">
            <form action="/">
              <div className="row">
                <div className="col col-10 text-left">
                  <input
                    type="search"
                    className="form-control"
                    id="s"
                    name="s"
                    placeholder="Search documentation and news"
                  />
                </div>
                <div className="col col-2 text-right">
                  <button type="submit" aria-describedby="svg-inline--fa-title-search-icon">
                    <FontAwesomeIcon icon={faSearch} title="Search button" titleId="search-icon" />
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="row">
            <div className="col-12">
              <h3 className="mt-2">
                <a className="" href="/data/summary">
                  My Genes
                </a>
              </h3>
              <div className="mobile-nav__sub-pages"></div>

              <h3 className="mt-2">
                <a
                  className="about-impc"
                  href="https://www.mousephenotype.org/about-impc/"
                >
                  About the IMPC
                </a>
              </h3>
              <div className="mobile-nav__sub-pages">
                <p>
                  <a href="https://www.mousephenotype.org/about-impc/consortium-members/">
                    Consortium Members
                  </a>
                </p>
                <div className="sub-pages"></div>

                <p>
                  <a href="https://www.mousephenotype.org/about-impc/collaborations/">
                    Collaborations
                  </a>
                </p>
                <div className="sub-pages"></div>

                <p>
                  <a href="https://www.mousephenotype.org/about-impc/funding/">
                    Funding
                  </a>
                </p>
                <div className="sub-pages"></div>

                <p>
                  <a href="https://www.mousephenotype.org/about-impc/animal-welfare/">
                    Animal Welfare
                  </a>
                </p>
                <div className="sub-pages"></div>

                <p>
                  <a href="https://www.mousephenotype.org/about-impc/about-komp/">
                    About KOMP
                  </a>
                </p>
                <div className="sub-pages"></div>

                <p>
                  <a href="https://www.mousephenotype.org/about-impc/about-ikmc/">
                    About IKMC
                  </a>
                </p>
                <div className="sub-pages"></div>
              </div>

              <h3 className="mt-2">
                <a
                  className="data"
                  href="https://www.mousephenotype.org/understand/"
                >
                  Data
                </a>
              </h3>
              <div className="mobile-nav__sub-pages">
                <p>
                  <a href="https://www.mousephenotype.org/understand/covid-19/">
                    COVID-19 Resources
                  </a>
                </p>
                <div className="sub-pages"></div>

                <p>
                  <a href="https://www.mousephenotype.org/understand/start-using-the-impc/">
                    Getting Started with IMPC Data
                  </a>
                </p>
                <div className="sub-pages">
                  <p>
                    <a href="https://www.mousephenotype.org/understand/start-using-the-impc/impc-data-generation/">
                      IMPC Data Generation
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/start-using-the-impc/how-to-use-gene-pages/">
                      How to Use Gene Pages
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/start-using-the-impc/citing-the-impc/">
                      Citing IMPC Data
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/start-using-the-impc/allele-design/">
                      Allele design
                    </a>
                  </p>
                </div>

                <p>
                  <a href="https://www.mousephenotype.org/understand/data-collections/">
                    IMPC Data Collections
                  </a>
                </p>
                <div className="sub-pages">
                  <p>
                    <a href="https://www.mousephenotype.org/understand/data-collections/late-adult-data/">
                      Late Adult Data
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/data-collections/histopathology/">
                      Histopathology
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/data-collections/essential-genes-portal/">
                      Essential genes
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/data-collections/embryo-development/">
                      Embryo Development
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/data-collections/cardiovascular/">
                      Cardiovascular
                    </a>
                  </p>
                </div>

                <p>
                  <a href="https://www.mousephenotype.org/understand/accessing-the-data/">
                    Accessing the Data
                  </a>
                </p>
                <div className="sub-pages">
                  <p>
                    <a href="https://www.mousephenotype.org/understand/accessing-the-data/latest-data-release/">
                      Latest Data Release
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/accessing-the-data/access-via-api/">
                      Access via API
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/accessing-the-data/access-via-ftp/">
                      Access via FTP
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/accessing-the-data/batch-query/">
                      Batch query
                    </a>
                  </p>
                </div>

                <p>
                  <a href="https://www.mousephenotype.org/understand/advanced-tools/">
                    Advanced Tools
                  </a>
                </p>
                <div className="sub-pages">
                  <p>
                    <a href="https://www.mousephenotype.org/understand/advanced-tools/phenodcc-homepage/">
                      PhenoDCC Tools
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/advanced-tools/imits/">
                      GenTaR
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/advanced-tools/openstats/">
                      OpenStats
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/advanced-tools/impress/">
                      IMPReSS
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/understand/advanced-tools/embryo-viewer/">
                      Embryo Viewer
                    </a>
                  </p>
                </div>
              </div>

              <h3 className="mt-2">
                <a
                  className="human-diseases"
                  href="https://www.mousephenotype.org/human-diseases/"
                >
                  Human Diseases
                </a>
              </h3>
              <div className="mobile-nav__sub-pages"></div>

              <h3 className="mt-2">
                <a
                  className="publications"
                  href="https://www.mousephenotype.org/publications/"
                >
                  Publications
                </a>
              </h3>
              <div className="mobile-nav__sub-pages">
                <p>
                  <a href="https://www.mousephenotype.org/publications/latest-impc-papers/">
                    Latest IMPC Papers
                  </a>
                </p>
                <div className="sub-pages"></div>

                <p>
                  <a href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/">
                    Data Supporting IMPC Papers
                  </a>
                </p>
                <div className="sub-pages">
                  <p>
                    <a href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/pain/">
                      Pain Sensitivity Associated Genes
                    </a>
                  </p>

                  <p>
                    <a
                      href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/essential-genes-linking-to-disease-2/">
                      Essential Genes - Linking to Disease
                    </a>
                  </p>

                  <p>
                    <a
                      href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/essential-genes-linking-to-disease/">
                      Essential Genes - Translating to Other Species
                    </a>
                  </p>

                  <p>
                    <a
                      href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/sexual-dimorphism/">
                      Sexual Dimorphism
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/hearing/">
                      Genes Critical for Hearing Identified
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/metabolism/">
                      Genetic Basis for Metabolic Diseases
                    </a>
                  </p>
                </div>

                <p>
                  <a href="https://www.mousephenotype.org/publications/papers-using-impc-resources/">
                    Papers Using IMPC Resources
                  </a>
                </p>
                <div className="sub-pages"></div>
              </div>

              <h3 className="mt-2">
                <a className="news" href="https://www.mousephenotype.org/news/">
                  News
                </a>
              </h3>
              <div className="mobile-nav__sub-pages"></div>

              <h3 className="mt-2">
                <a className="blog" href="https://www.mousephenotype.org/blog/">
                  Blog
                </a>
              </h3>
              <div className="mobile-nav__sub-pages"></div>

              <h3 className="mt-2">
                <a className="object-id-11" href="//www.mousephenotype.org/help/">
                  Help
                </a>
              </h3>
              <div className="mobile-nav__sub-pages"></div>

              <h3 className="mt-2">
                <a href="http://cloud.mousephenotype.org">IMPC Cloud</a>
              </h3>
              <div className="mobile-nav__sub-pages"></div>

              <h3 className="mt-2">
                <a
                  className="object-id-12"
                  href="//www.mousephenotype.org/contact-us/"
                >
                  Contact us
                </a>
              </h3>
              <div className="mobile-nav__sub-pages"></div>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Header;
