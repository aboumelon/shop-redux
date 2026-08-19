export type OfferCartProps = {
  imgSrc: string;
  offerCount: number;
  offerSpecial: string;
  height: number;
};

const OfferCart = ({
  offerCount,
  offerSpecial,
  imgSrc,
  height,
}: OfferCartProps) => {
  return (
    <div className="product-offer mb-30" style={{ height: height }}>
      <img className="img-fluid" src={imgSrc} alt="" />
      <div className="offer-text">
        <h6 className="text-white text-uppercase">save {offerCount}%</h6>
        <h3 className="text-white mb-3">{offerSpecial}</h3>
        <a href="/" className="btn btn-primary">
          Shop Now
        </a>
      </div>
    </div>
  );
};

export default OfferCart;
