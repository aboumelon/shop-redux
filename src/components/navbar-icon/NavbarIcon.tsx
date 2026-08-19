type NavbarIconProps = {
  icon: JSX.Element;
  count: number;
};

function NavbarIcon({ icon, count }: NavbarIconProps) {
  return (
    <a href="/" className="btn px-0">
      {icon}
      <span
        className="badge text-secondary border border-secondary rounded-circle ml-1"
        style={{ paddingBottom: 2 }}
      >
        {count}
      </span>
    </a>
  );
}

export default NavbarIcon;
