const ProductQuantityButton = () => {
  return (
    <div className="input-group quantity" style={{ width: 130 }}>
      <div className="input-group-btn">
        <button className="btn btn-primary btn-minus">
          <i className="fa fa-minus" />
        </button>
      </div>
      <input
        type="text"
        className="form-control bg-secondary border-0 text-center"
        defaultValue={1}
      />
      <div className="input-group-btn">
        <button className="btn btn-primary btn-plus">
          <i className="fa fa-plus" />
        </button>
      </div>
    </div>
  );
};

export default ProductQuantityButton;
