export const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1.2,
  slidesToScroll: 1,
  arrows: false,
  responsive: [{
    breakpoint: 500,
    settings: {
      slidesToShow: 1.2,
    }
  },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1.5,
      }
    },
    {
      breakpoint: 769,
      settings: {
        slidesToShow: 2.2,
      }
    }]
};

export const settingsForListitem = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  arrows: false,
};
