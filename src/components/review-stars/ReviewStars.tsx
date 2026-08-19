const ReviewStars = () => {
  return (
    <div className="d-flex">
      <div className="text-primary mr-2">
        <small className="fas fa-star" />
        <small className="fas fa-star" />
        <small className="fas fa-star" />
        <small className="fas fa-star-half-alt" />
        <small className="far fa-star" />
      </div>
      <small className="pt-1">(99 Reviews)</small>
    </div>
  );
};

export default ReviewStars;
