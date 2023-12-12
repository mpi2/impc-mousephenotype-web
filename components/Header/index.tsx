import { useState } from "react";
import headerCss from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";

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
      return '/metabolism'
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
    </div>
  );
};

export default Header;
