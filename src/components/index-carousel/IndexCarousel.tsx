import { useState } from "react";

const IndexCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(1);

  const indicatorClick = (slideNumber: number) => {
    setActiveSlide(slideNumber);
  };

  return (
    <div
      id="header-carousel"
      className="carousel slide carousel-fade mb-30 mb-lg-0"
    >
      <ol className="carousel-indicators">
        <li
          className={activeSlide === 1 ? "active" : ""}
          onClick={() => indicatorClick(1)}
        />
        <li
          className={activeSlide === 2 ? "active" : ""}
          onClick={() => indicatorClick(2)}
        />
        <li
          className={activeSlide === 3 ? "active" : ""}
          onClick={() => indicatorClick(3)}
        />
      </ol>
      <div className="carousel-inner">
        <div
          className={
            activeSlide === 1
              ? "carousel-item position-relative active"
              : "carousel-item position-relative"
          }
          style={{ height: 430 }}
        >
          <img
            className="position-absolute w-100 h-100"
            alt="shop"
            src="../assets/img/carousel-1.jpg"
            style={{ objectFit: "cover" }}
          />
          <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
            <div className="p-3" style={{ maxWidth: 700 }}>
              <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">
                Men Fashion
              </h1>
              <p className="mx-md-5 px-5 animate__animated animate__bounceIn">
                Lorem rebum magna amet lorem magna erat diam stet. Sadips duo
                stet amet amet ndiam elitr ipsum diam
              </p>
              <a
                className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp"
                href="/"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
        <div
          className={
            activeSlide === 2
              ? "carousel-item position-relative active"
              : "carousel-item position-relative"
          }
          style={{ height: 430 }}
        >
          <img
            className="position-absolute w-100 h-100"
            src="../assets/img/carousel-2.jpg"
            alt="shop"
            style={{ objectFit: "cover" }}
          />
          <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
            <div className="p-3" style={{ maxWidth: 700 }}>
              <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">
                Women Fashion
              </h1>
              <p className="mx-md-5 px-5 animate__animated animate__bounceIn">
                Lorem rebum magna amet lorem magna erat diam stet. Sadips duo
                stet amet amet ndiam elitr ipsum diam
              </p>
              <a
                className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp"
                href="/"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
        <div
          className={
            activeSlide === 3
              ? "carousel-item position-relative active"
              : "carousel-item position-relative"
          }
          style={{ height: 430 }}
        >
          <img
            className="position-absolute w-100 h-100"
            src="../assets/img/carousel-3.jpg"
            alt="shop"
            style={{ objectFit: "cover" }}
          />
          <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
            <div className="p-3" style={{ maxWidth: 700 }}>
              <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">
                Kids Fashion
              </h1>
              <p className="mx-md-5 px-5 animate__animated animate__bounceIn">
                Lorem rebum magna amet lorem magna erat diam stet. Sadips duo
                stet amet amet ndiam elitr ipsum diam
              </p>
              <a
                className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp"
                href="/"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexCarousel;
