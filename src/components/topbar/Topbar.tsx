// components
import HelpLinks from "../help-links/HelpLinks";
import TopbarButton from "../topbar-button/TopbarButton";
import MultiShopIcon from "../multi-shop-icon/MultiShopIcon";
import SearchProductsInput from "../search-products-input/SearchProductsInput";

function Topbar() {
  return (
    <div className="container-fluid">
      <div className="row bg-secondary py-1 px-xl-5">
        <div className="col-lg-6 d-none d-lg-block">
          <HelpLinks />
        </div>
        <div className="col-lg-6 text-center text-lg-right">
          <div className="d-inline-flex align-items-center">
            <TopbarButton
              buttonName={"My Account"}
              dropdownNames={["Sign in", "Sign up"]}
            />
            <TopbarButton
              buttonName={"USD"}
              dropdownNames={["EUR", "GBP", "CAD"]}
              className={"mx-2"}
            />
            <TopbarButton
              buttonName={"EN"}
              dropdownNames={["EN", "FR", "RU"]}
            />
          </div>
        </div>
      </div>
      <div className="row align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex">
        <div className="col-lg-4">
          <MultiShopIcon classNames={"text-decoration-none"} />
        </div>
        <div className="col-lg-4 col-6 text-left">
          <SearchProductsInput />
        </div>
        <div className="col-lg-4 col-6 text-right">
          <p className="m-0">Customer Service</p>
          <h5 className="m-0">+012 345 6789</h5>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
