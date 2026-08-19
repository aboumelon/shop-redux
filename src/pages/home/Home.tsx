// components
import IndexCarousel from "../../components/index-carousel/IndexCarousel";
import OfferCart from "../../components/offer-cart/OfferCart";
import FeaturedList from "../../components/featured-list/FeaturedList";
import CardList from "../../components/card-list/CardList";
import CategoryCard from "../../components/category-card/CategoryCard";
import ProductCard from "../../components/product-card/ProductCard";
import VendorCarousel from "../../components/vendor-carousel/VendorCarousel";

// data
import { categoryList, featuredList, productList } from "./homeData";

function Home() {
  return (
    <>
      <div className="container-fluid mb-3">
        <div className="row px-xl-5">
          <div className="col-lg-8">
            <IndexCarousel />
          </div>
          <div className="col-lg-4">
            <OfferCart
              imgSrc="../assets/img/offer-1.jpg"
              height={200}
              offerCount={25}
              offerSpecial="Special Offer"
            />
            <OfferCart
              imgSrc="/../assets/img/offer-2.jpg"
              height={200}
              offerCount={20}
              offerSpecial="Special Offer"
            />
          </div>
        </div>
      </div>
      <div className="container-fluid pt-5">
        <FeaturedList features={featuredList} />
      </div>
      <div className="container-fluid pt-5">
        <CardList
          type="category"
          title="Categories"
          Card={CategoryCard}
          cardList={categoryList}
        />
      </div>
      <div className="container-fluid pt-5">
        <CardList
          type="product"
          title="Featured Products"
          Card={ProductCard}
          cardList={productList}
        />
      </div>
      <div className="container-fluid pt-5 pb-3">
        <div className="row px-xl-5">
          <div className="col-md-6">
            <OfferCart
              imgSrc="../assets/img/offer-1.jpg"
              height={300}
              offerCount={20}
              offerSpecial="Special Offer"
            />
          </div>
          <div className="col-md-6">
            <OfferCart
              imgSrc="../assets/img/offer-1.jpg"
              height={300}
              offerCount={20}
              offerSpecial="Special Offer"
            />
          </div>
        </div>
      </div>
      <div className="container-fluid pt-5">
        <CardList
          type="product"
          title="Recent Products"
          Card={ProductCard}
          cardList={productList}
        />
      </div>
      <div className="container-fluid py-5">
        <div className="row px-xl-5">
          <div className="col">
            <VendorCarousel />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
