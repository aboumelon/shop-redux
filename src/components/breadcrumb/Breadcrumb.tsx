import { Link } from "react-router-dom";

export type BreadcrumbProps = {
  path: {
    linkName: string;
    href?: string;
  }[];
};

const Breadcrumb = ({ path }: BreadcrumbProps) => {
  return (
    <nav className="breadcrumb bg-light mb-30">
      {path.map((value, index, p) => {
        if (index === p.length - 1) {
          return (
            <span
              key={value.linkName}
              className="breadcrumb-item text-dark active"
            >
              {value.linkName}
            </span>
          );
        }
        if (value.href && value.linkName) {
          return (
            <Link
              key={value.linkName}
              className="breadcrumb-item text-dark"
              to={value.href}
            >
              {value.linkName}
            </Link>
          );
        }
      })}
    </nav>
  );
};

export default Breadcrumb;
