type ProductOptionsProps = {
  optionName: string;
  inputName: string;
  items: {
    label: string;
  }[];
};

const ProductOptions = ({
  optionName,
  inputName,
  items,
}: ProductOptionsProps) => {
  return (
    <div className="d-flex">
      <strong className="text-dark mr-3">{optionName}:</strong>
      <form>
        {items.map((item, index) => {
          return (
            <div className="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                className="custom-control-input"
                id={`${inputName}-${index}`}
                name={inputName}
              />
              <label
                className="custom-control-label"
                htmlFor={`${inputName}-${index}`}
              >
                {item.label}
              </label>
            </div>
          );
        })}
      </form>
    </div>
  );
};

export default ProductOptions;
