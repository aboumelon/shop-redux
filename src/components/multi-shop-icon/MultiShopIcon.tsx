type MultiShopIconProps = {
  classNames: string;
};

function MultiShopIcon({ classNames }: MultiShopIconProps) {
  return (
    <a href="/" className={classNames}>
      <span className="h1 text-uppercase text-primary bg-dark px-2">Multi</span>
      <span className="h1 text-uppercase text-dark bg-primary px-2 ml-n1">
        Shop
      </span>
    </a>
  );
}

export default MultiShopIcon;
