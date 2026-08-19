type NavbarLinksProps = {
  navLinks: {
    link: string;
    dropdown?: string[];
  }[];
};

function NavbarLinks({ navLinks }: NavbarLinksProps) {
  return (
    <div className="navbar-nav mr-auto py-0">
      {navLinks.map((link) => {
        if (link.dropdown) {
          return (
            <div className="nav-item dropdown" key={link.link}>
              <a
                href="/"
                className="nav-link dropdown-toggle"
                data-toggle="dropdown"
              >
                {link.link} <i className="fa fa-angle-down mt-1" />
              </a>
              <div className="dropdown-menu bg-primary rounded-0 border-0 m-0">
                {link.dropdown.map((value) => (
                  <a href="/" className="dropdown-item" key={value}>
                    {value}
                  </a>
                ))}
              </div>
            </div>
          );
        }
        return (
          <a href="/" className="nav-item nav-link " key={link.link}>
            {link.link}
          </a>
        );
      })}
    </div>
  );
}

export default NavbarLinks;
