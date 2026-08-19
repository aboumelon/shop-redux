export type FeaturedListProps = {
  features: {
    icon: JSX.Element;
    name: string;
  }[];
};

const FeaturedList = ({ features }: FeaturedListProps) => {
  return (
    <div className="row px-xl-5 pb-3">
      {features.map((value) => {
        return (
          <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
            <div
              className="d-flex align-items-center bg-light mb-4"
              style={{ padding: "30px" }}
            >
              {value.icon}
              <h5 className="font-weight-semi-bold m-0">{value.name}</h5>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedList;
