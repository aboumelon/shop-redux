import React from "react";

// components && types
import CardListHeader from "./CardListHeader";
import { CategoryCardProps } from "../category-card/CategoryCard";
import { ProductCardProps } from "../product-card/ProductCard";

export type CategoryCardListProps = {
  type: "category";
  title: string;
  Card: React.FC<CategoryCardProps>;
  cardList: CategoryCardProps[];
};

export type ProductCardListProps = {
  type: "product";
  title: string;
  Card: React.FC<ProductCardProps>;
  cardList: ProductCardProps[];
};

export type ShopProductCardListProps = {
  type: "shop-product";
  title?: string;
  Card: React.FC<ProductCardProps>;
  cardList: ProductCardProps[];
};

const CardList = ({
  title,
  Card,
  cardList,
  type,
}: CategoryCardListProps | ProductCardListProps | ShopProductCardListProps) => {
  if (type === "product" || type === "category") {
    return (
      <>
        <CardListHeader title={title} />
        <div className="row px-xl-5">
          {type === "category" &&
            cardList.map((card, i) => {
              return (
                <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                  <Card
                    key={i}
                    categoryName={card.categoryName}
                    imgSrc={card.imgSrc}
                    productNum={card.productNum}
                  />
                </div>
              );
            })}
          {type === "product" &&
            cardList.map((card, i) => {
              return (
                <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                  <Card
                    key={i}
                    imgSrc={card.imgSrc}
                    productName={card.productName}
                    price={card.price}
                    discountPrice={card.discountPrice}
                    productVoteNum={card.productVoteNum}
                  />
                </div>
              );
            })}
        </div>
      </>
    );
  }
  return (
    <>
      {type === "shop-product" &&
        cardList.map((card, i) => {
          return (
            <div className="col-lg-4 col-md-6 col-sm-6 pb-1">
              <Card
                key={i}
                imgSrc={card.imgSrc}
                productName={card.productName}
                price={card.price}
                discountPrice={card.discountPrice}
                productVoteNum={card.productVoteNum}
              />
            </div>
          );
        })}
    </>
  );
};

export default CardList;
