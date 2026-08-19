//  components
import ReviewStars from "../review-stars/ReviewStars";
import ProductOptions from "../product-options/ProductOptions";
import ProductQuantityButton from "../product-quantity-button/ProductQuantityButton";

// data
import {
  colorOptions,
  sizeOptions,
} from "../../pages/product-detail/productDetailData";

const ProductInfo = () => {
  return (
    <div className="h-100 bg-light p-30">
      <h3>Product Name Goes Here</h3>
      <div className="mb-3">
        <ReviewStars />
      </div>
      <h3 className="font-weight-semi-bold mb-4">$150.00</h3>
      <p className="mb-4">
        Volup erat ipsum diam elitr rebum et dolor. Est nonumy elitr erat diam
        stet sit clita ea. Sanc ipsum et, labore clita lorem magna duo dolor no
        sea Nonumy
      </p>
      <div className="mb-3">
        <ProductOptions
          optionName="Sizes"
          inputName="size"
          items={sizeOptions}
        />
      </div>
      <div className="d-flex mb-4">
        <ProductOptions
          optionName="Colors"
          inputName="color"
          items={colorOptions}
        />
      </div>
      <div className="d-flex align-items-center mb-4 pt-2">
        <ProductQuantityButton />
        <button className="btn btn-primary px-3 ml-3">
          <i className="fa fa-shopping-cart mr-1" /> Add To Cart
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
