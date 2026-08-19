import { useState } from "react";

type CategoryListMenuProps = {
  categories: {
    link: string;
    dropdown?: string[];
  }[];
};

function CategoryListMenu({ categories }: CategoryListMenuProps) {
  const [openCategoryList, setOpenCategoryList] = useState(false);

  return (
    <>
      <a
        className={`btn d-flex align-items-center justify-content-between bg-primary w-100 ${openCategoryList ? "" : "collapsed"}`}
        data-toggle="collapse"
        // href='/'
        aria-expanded={openCategoryList}
        style={{ height: 65, padding: "0 30px" }}
        onClick={() => setOpenCategoryList(!openCategoryList)}
      >
        <h6 className="text-dark m-0">
          <i className="fa fa-bars mr-2" />
          Categories
        </h6>
        <i className="fa fa-angle-down text-dark" />
      </a>
      <nav
        className={`collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 bg-light ${openCategoryList ? "show" : "collapsing"}`}
        id="navbar-vertical"
        style={{ width: "calc(100% - 30px)", zIndex: 999 }}
      >
        <div className="navbar-nav w-100">
          {categories.map((category) => {
            if (category.dropdown) {
              return (
                <div
                  className="nav-item dropdown dropright"
                  key={category.link}
                >
                  <a
                    href="/"
                    className="nav-link dropdown-toggle"
                    data-toggle="dropdown"
                  >
                    {category.link}{" "}
                    <i className="fa fa-angle-right float-right mt-1" />
                  </a>
                  <div className="dropdown-menu position-absolute rounded-0 border-0 m-0">
                    {category.dropdown.map((value) => (
                      <a href="/" className="dropdown-item" key={value}>
                        {value}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <a href="/" className="nav-item nav-link" key={category.link}>
                {category.link}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default CategoryListMenu;
