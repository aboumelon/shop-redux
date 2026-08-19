// components
import FilterProduct from "../../components/filter-product/FilterProduct";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import ProductList from "./ProductList";

// data
import {
  shopPath,
  filterPrice,
  filterColor,
  filterSize,
  shopProductList,
} from "./shopData";

const Shop = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-12">
            <Breadcrumb path={shopPath} />
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-lg-3 col-md-4">
            <FilterProduct title="Filter by price" filterFields={filterPrice} />
            <FilterProduct title="Filter by color" filterFields={filterColor} />
            <FilterProduct title="Filter by size" filterFields={filterSize} />
          </div>
          <div className="col-lg-9 col-md-8 pb-3">
            <ProductList productList={shopProductList} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
