//  components
import TopbarButton from "../../components/topbar-button/TopbarButton";
import CardList from "../../components/card-list/CardList";
import ProductCard, {
  ProductCardProps,
} from "../../components/product-card/ProductCard";
import Pagination from "../../components/pagination/Pagination";

type ProductListProps = {
  productList: ProductCardProps[];
};

const ProductList = ({ productList }: ProductListProps) => {
  return (
    <div className="row">
      <div className="col-12 pb-1">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <button className="btn btn-sm btn-light">
              <i className="fa fa-th-large" />
            </button>
            <button className="btn btn-sm btn-light ml-2">
              <i className="fa fa-bars" />
            </button>
          </div>
          <div className="ml-2 d-flex">
            <TopbarButton
              buttonName="Sorting"
              dropdownNames={["Latest", "Popularity", "Best Rating"]}
            />
            <TopbarButton
              className="ml-2"
              buttonName="Showing"
              dropdownNames={["10", "20", "30"]}
            />
          </div>
        </div>
      </div>
      <CardList type="shop-product" Card={ProductCard} cardList={productList} />
      <div className="col-12">
        <Pagination />
      </div>
    </div>
  );
};

export default ProductList;
