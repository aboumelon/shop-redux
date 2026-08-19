//  components
import CardListHeader from "../card-list/CardListHeader";
import ProductCard from "../product-card/ProductCard";

const PopularProductsCarousel = () => {
  return (
    <div className="container-fluid py-5">
      <CardListHeader title="You May Also Like" />
      <div className="row px-xl-5">
        <div className="col">
          <div className="owl-carousel related-carousel">
            <ProductCard
              imgSrc="../assets/img/product-1.jpg"
              productName="Product Name Goes Here"
              productVoteNum={99}
              price={123.0}
              discountPrice={123.0}
            />
            <ProductCard
              imgSrc="../assets/img/product-2.jpg"
              productName="Product Name Goes Here"
              productVoteNum={99}
              price={123.0}
              discountPrice={123.0}
            />
            <ProductCard
              imgSrc="../assets/img/product-3.jpg"
              productName="Product Name Goes Here"
              productVoteNum={99}
              price={123.0}
              discountPrice={123.0}
            />
            <ProductCard
              imgSrc="../assets/img/product-4.jpg"
              productName="Product Name Goes Here"
              productVoteNum={99}
              price={123.0}
              discountPrice={123.0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularProductsCarousel;
