export type FilterProductProps = {
  title: string;
  filterFields: {
    filterName: string;
    value: string;
    numOfProducts: number;
  }[];
};

const FilterProduct = ({ title, filterFields }: FilterProductProps) => {
  const fieldClass =
    "custom-control custom-checkbox d-flex align-items-center justify-content-between";
  return (
    <>
      <h5 className="section-title position-relative text-uppercase mb-3">
        <span className="bg-secondary pr-3">{title}</span>
      </h5>
      <div className="bg-light p-4 mb-30">
        <form>
          {filterFields.map((filterField, index) => {
            return (
              <div
                className={
                  index === filterFields.length - 1
                    ? fieldClass
                    : fieldClass + " mb-3"
                }
                key={index}
              >
                <input
                  type="checkbox"
                  value={filterField.value}
                  className="custom-control-input"
                  id={filterField.filterName}
                />
                <label
                  className="custom-control-label"
                  htmlFor={filterField.filterName}
                >
                  {filterField.filterName}
                </label>
                <span className="badge border font-weight-normal">
                  {filterField.numOfProducts}
                </span>
              </div>
            );
          })}
        </form>
      </div>
    </>
  );
};

export default FilterProduct;
