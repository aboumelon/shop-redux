export type CategoryCardProps = {
  imgSrc: string;
  categoryName: string;
  productNum: number;
};

const CategoryCard = ({
  categoryName,
  imgSrc,
  productNum,
}: CategoryCardProps) => {
  return (
    <a className="text-decoration-none">
      <div className="cat-item d-flex align-items-center mb-4">
        <div
          className="overflow-hidden"
          style={{ width: "100px", height: "100px" }}
        >
          <img className="img-fluid" src={imgSrc} alt="" />
        </div>
        <div className="flex-fill pl-3">
          <h6>{categoryName}</h6>
          <small className="text-body">{productNum} Products</small>
        </div>
      </div>
    </a>
  );
};

export default CategoryCard;
