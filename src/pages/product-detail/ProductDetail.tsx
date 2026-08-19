//  components
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import ProductCarousel from "../../components/product-carousel/ProductCarousel";
import ProductInfo from "../../components/product-info/ProductInfo";
import ProductTabs from "../../components/product-tabs/ProductTabs";
import PopularProductsCarousel from "../../components/popular-products-carousel/PopularProductsCarousel";

//  data
import { detailPath } from "./productDetailData";

const ProductDetail = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-12">
            <Breadcrumb path={detailPath} />
          </div>
        </div>
      </div>
      <div className="container-fluid pb-5">
        <div className="row px-xl-5">
          <div className="col-lg-5 mb-30">
            <ProductCarousel />
          </div>
          <div className="col-lg-7 h-auto mb-30">
            <ProductInfo />
          </div>
        </div>
        <div className="row px-xl-5">
          <div className="col">
            <ProductTabs />
          </div>
        </div>
      </div>
      <PopularProductsCarousel />
    </>
  );
};

export default ProductDetail;
