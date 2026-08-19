const ProductCarousel = () => {
  return (
    <div id="product-carousel" className="carousel slide" data-ride="carousel">
      <div className="carousel-inner bg-light">
        <div className="carousel-item active">
          <img
            className="w-100 h-100"
            src="../assets/img/product-1.jpg"
            alt=""
          />
        </div>
        <div className="carousel-item">
          <img
            className="w-100 h-100"
            src="../assets/img/product-2.jpg"
            alt=""
          />
        </div>
        <div className="carousel-item">
          <img
            className="w-100 h-100"
            src="../assets/img/product-3.jpg"
            alt=""
          />
        </div>
        <div className="carousel-item">
          <img
            className="w-100 h-100"
            src="../assets/img/product-4.jpg"
            alt=""
          />
        </div>
      </div>
      <span className="carousel-control-prev" data-slide="prev">
        <i className="fa fa-2x fa-angle-left text-dark" />
      </span>
      <span className="carousel-control-next" data-slide="next">
        <i className="fa fa-2x fa-angle-right text-dark" />
      </span>
    </div>
  );
};

export default ProductCarousel;
