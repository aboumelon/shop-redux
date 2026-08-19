import NavbarIcon from "../navbar-icon/NavbarIcon";
import NavbarLinks from "../navbar-links/NavbarLinks";
import MultiShopIcon from "../multi-shop-icon/MultiShopIcon";
import CategoryListMenu from "../category-list-menu/CategoryListMenu";

const navbarLinks = [
  {
    link: "Home",
  },
  {
    link: "Shop",
  },
  {
    link: "Shop Detail",
  },
  {
    link: "Pages",
    dropdown: ["Shopping Cart", "Checkout"],
  },
  {
    link: "Contact",
  },
];

const categoryList = [
  {
    link: "Dresses",
    dropdown: ["Men's Dresses", "Women's Dresses", "Baby's Dresses"],
  },
  {
    link: "Shirts",
  },
  {
    link: "Swimwear",
  },
  {
    link: "Jeans",
  },
  {
    link: "Sleepwear",
  },
  {
    link: "Sportswear",
  },
  {
    link: "Jumpsuits",
  },
  {
    link: "Blazers",
  },
  {
    link: "Jackets",
  },
  {
    link: "Shoes",
  },
];

function Navbar() {
  return (
    <>
      <div className="container-fluid bg-dark mb-30">
        <div className="row px-xl-5">
          <div className="col-lg-3 d-none d-lg-block">
            <CategoryListMenu categories={categoryList} />
          </div>
          <div className="col-lg-9">
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
              <MultiShopIcon
                classNames={"text-decoration-none d-block d-lg-none"}
              />
              <button
                type="button"
                className="navbar-toggler"
                data-toggle="collapse"
                data-target="#navbarCollapse"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div
                className="collapse navbar-collapse justify-content-between"
                id="navbarCollapse"
              >
                <NavbarLinks navLinks={navbarLinks} />
                <div
                  className="navbar-nav ml-auto py-0 d-none d-lg-flex justify-content-between"
                  style={{ gap: "7px" }}
                >
                  <NavbarIcon
                    icon={<i className="fas fa-heart text-primary" />}
                    count={0}
                  />
                  <NavbarIcon
                    icon={<i className="fas fa-shopping-cart text-primary" />}
                    count={0}
                  />
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
