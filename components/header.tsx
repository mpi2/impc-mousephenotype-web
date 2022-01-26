const Header = () => {
  return (
    <div className="header">
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

      <div className="header__nav">
        <div className="container">
          <div className="row">
            <div className="col-3">
              <a href="/" className="header__logo-link active">
                <img
                  className="header__logo lazy loaded"
                  src="https://www.mousephenotype.org/wp-content/themes/impc/images/IMPC_10_YEAR_Logo.svg"
                  data-src="https://www.mousephenotype.org/wp-content/themes/impc/images/IMPC_10_YEAR_Logo.svg"
                  alt="Internation Mouse Phenotyping Consortium Office Logo"
                  data-was-processed="true"
                  width="190px"
                />
              </a>
            </div>
            <div className="col-9 text-right">
              <span className="d-none d-lg-block">
                <div className="menu-main-nav-container">
                  <ul id="menu-main-nav" className="menu">
                    <li id="" className="menu-item  ">
                      <a href="/data/summary">My Genes</a>
                    </li>

                    <li id="about-impc" className="menu-item about-impc ">
                      <a href="https://www.mousephenotype.org/about-impc/">
                        About the IMPC
                      </a>
                    </li>

                    <li id="data" className="menu-item data current-menu-item">
                      <a
                        href="https://www.mousephenotype.org/understand/"
                        className=""
                      >
                        Data
                      </a>
                    </li>

                    <li
                      id="human-diseases"
                      className="menu-item human-diseases "
                    >
                      <a href="https://www.mousephenotype.org/human-diseases/">
                        Human Diseases
                      </a>
                    </li>

                    <li id="publications" className="menu-item publications ">
                      <a href="https://www.mousephenotype.org/publications/">
                        Publications
                      </a>
                    </li>

                    <li id="news" className="menu-item news ">
                      <a href="https://www.mousephenotype.org/news/">News</a>
                    </li>

                    <li id="blog" className="menu-item blog ">
                      <a href="https://www.mousephenotype.org/blog/">Blog</a>
                    </li>
                  </ul>
                </div>
              </span>
              <button
                className="navbar-toggler collapsed d-inline d-lg-none "
                type="button"
                data-toggle="collapse"
                data-target="#navbarToggleExternalContent "
                aria-controls="navbarToggleExternalContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="icon-bar top-bar"></span>
                <span className="icon-bar middle-bar"></span>
                <span className="icon-bar bottom-bar"></span>
              </button>
              <div className="collapse" id="searchBar">
                <form action="/">
                  <div className="row search-pop no-gutters">
                    <div className="search-pop__input col col-9 text-left">
                      <p>
                        <br />
                      </p>
                      <input
                        id="searchField"
                        type="search"
                        className="form-control"
                        name="s"
                        placeholder="Search documentation and news"
                      />
                    </div>
                    <div className="col col-3 text-right search-submit">
                      <button type="submit">
                        Search <i className="fal fa-search"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="header__drop"></div>

      <div className="mobile-nav collapse" id="navbarToggleExternalContent">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarToggleExternalContent "
          aria-controls="navbarToggleExternalContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="icon-bar top-bar"></span>
          <span className="icon-bar middle-bar"></span>
          <span className="icon-bar bottom-bar"></span>
        </button>
        <p className="mobile-nav__search-text">
          <br />
        </p>
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
                <button type="submit">
                  <i className="fas fa-search"></i>
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
                  <a href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/essential-genes-linking-to-disease-2/">
                    Essential Genes - Linking to Disease
                  </a>
                </p>

                <p>
                  <a href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/essential-genes-linking-to-disease/">
                    Essential Genes - Translating to Other Species
                  </a>
                </p>

                <p>
                  <a href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/sexual-dimorphism/">
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

      <div className=" sub-menu collapse" id=""></div>

      <div className="about-menu sub-menu collapse" id="about-menu">
        <div className="about-menu__inside">
          <div className="container">
            <div className="row no-gutters justify-content-end">
              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/about-impc/">
                  About the IMPC
                </a>
              </div>

              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/about-impc/consortium-members/">
                  Consortium Members
                </a>
                <div className="sub-pages"></div>
              </div>

              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/about-impc/collaborations/">
                  Collaborations
                </a>
                <div className="sub-pages"></div>
              </div>

              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/about-impc/funding/">
                  Funding
                </a>
                <div className="sub-pages"></div>
              </div>

              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/about-impc/animal-welfare/">
                  Animal Welfare
                </a>
                <div className="sub-pages"></div>
              </div>

              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/about-impc/about-komp/">
                  About KOMP
                </a>
                <div className="sub-pages"></div>
              </div>

              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/about-impc/about-ikmc/">
                  About IKMC
                </a>
                <div className="sub-pages"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="about-menu__drop"></div>
      </div>

      <div
        className="data-menu sub-menu collapse"
        id="data-menu"
        style={{
          display: 'none',
          height: 214,
          paddingTop: 0,
          marginTop: 0,
          paddingBottom: 0,
          marginBottom: 0,
        }}
      >
        <div className="data-menu__inside">
          <div className="container">
            <div className="row no-gutters justify-content-end">
              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/understand/covid-19/">
                  COVID-19 Resources
                </a>
                <div className="sub-pages"></div>
              </div>

              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/understand/start-using-the-impc/">
                  Getting Started with IMPC Data
                </a>
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
              </div>

              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/understand/data-collections/">
                  IMPC Data Collections
                </a>
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
              </div>

              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/understand/accessing-the-data/">
                  Accessing the Data
                </a>
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
              </div>

              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/understand/advanced-tools/">
                  Advanced Tools
                </a>
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
            </div>
          </div>
        </div>
        <div className="data-menu__drop"></div>
      </div>

      <div className=" sub-menu collapse" id=""></div>

      <div
        className="publications-menu sub-menu collapse"
        id="publications-menu"
      >
        <div className="publications-menu__inside">
          <div className="container">
            <div className="row no-gutters justify-content-end">
              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/publications/latest-impc-papers/">
                  Latest IMPC Papers
                </a>
                <div className="sub-pages"></div>
              </div>

              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/">
                  Data Supporting IMPC Papers
                </a>
                <div className="sub-pages">
                  <p>
                    <a href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/pain/">
                      Pain Sensitivity Associated Genes
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/essential-genes-linking-to-disease-2/">
                      Essential Genes - Linking to Disease
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/essential-genes-linking-to-disease/">
                      Essential Genes - Translating to Other Species
                    </a>
                  </p>

                  <p>
                    <a href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/sexual-dimorphism/">
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
              </div>

              <div className="col col-auto text-left">
                <a href="https://www.mousephenotype.org/publications/papers-using-impc-resources/">
                  Papers Using IMPC Resources
                </a>
                <div className="sub-pages"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="publications-menu__drop"></div>
      </div>

      <div className="news-menu sub-menu collapse" id="news-menu"></div>

      <div className=" sub-menu collapse" id=""></div>

      <style jsx>
        {`
          .header__nav-top {
            color: black;
            background-color: #efefef;
            font-size: 14px;
            height: 40px;
            line-height: 40px;
          }
          .menu-top-nav-container {
            display: inline;
          }
          ul#menu-top-nav {
            display: inline;
            margin: 0;
            padding: 0;
          }
          ul#menu-top-nav li {
            display: inline-block;
            list-style: none;
            padding: 0;
            margin: 0;
            margin-left: 20px;
          }
          ul#menu-top-nav li a {
            text-decoration: none;
            color: #000;
            font-size: 14px;
            font-weight: 700;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            padding-bottom: 7px;
            padding-top: 15px;
          }
          .text-right {
            text-align: right;
          }
          ul#menu-top-nav li a:hover {
              border-bottom: 5px solid #8e8e8e;
              text-decoration: none;
          }
          .container {
            position: relative;
            max-width: 1240px;
            width: 100%;
            margin-right: auto;
            margin-left: auto;
            padding-right: 20px;
            padding-left: 20px;
          }
          .container > .row {
            margin-left: 0;
            margin-right: 0;
            --bs-gutter-x: 2.5rem;
          }
        `}
      </style>
    </div>
  );
};

export default Header;
