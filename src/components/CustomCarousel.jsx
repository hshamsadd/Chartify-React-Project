import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import useEmblaCarousel from "embla-carousel-react";
import SliderItem from "./SliderItem.jsx";

const CustomCarousel = ({ category, data, type }) => {
  const [isHoverCategory, setIsHoverCategory] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 4,
    align: "start",
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Generate correct route based on type
  const getSlideLink = (slide) => {
    switch (type) {
      case "track":
        return `/track/${slide.id}`;
      case "album":
        return `/album/${slide.id}`;
      case "artist":
        return `/artist/${slide.id}`;
      case "playlist":
        return `/playlist/${slide.id}`;
      case "podcast":
        return `/podcast/${slide.id}`;
      default:
        return "/";
    }
  };

  return (
    <div>
      <div className="flex justify-between pb-5 ml-8 mr-6">
        {/* Category section */}
        <div
          onMouseEnter={() => setIsHoverCategory(true)}
          onMouseLeave={() => setIsHoverCategory(false)}
          className={`flex items-center font-semibold text-xl cursor-pointer ${
            isHoverCategory ? "text-[#f8f6f6]" : "text-white"
          }`}
        >
          {category}
          <hr
            className={`mt-1 ${
              isHoverCategory ? "text-[#f8f6f6]" : "text-white"
            }`}
            size={25}
          />
        </div>

        {/* Chevron buttons */}
        <div className="flex items-center">
          <button
            onClick={scrollPrev}
            className="group rounded-full p-2 transition-colors duration-200 hover:bg-white"
          >
            <MdChevronLeft
              size={30}
              className="text-white transition-colors duration-200 group-hover:text-[#0ea5e9]"
            />
          </button>

          <div className="px-2"></div>

          <button
            onClick={scrollNext}
            className="group rounded-full p-2 transition-colors duration-200 hover:bg-white"
          >
            <MdChevronRight
              size={30}
              className="text-white transition-colors duration-200 group-hover:text-[#0ea5e9]"
            />
          </button>
        </div>
      </div>

      <div className="overflow-hidden mr-8" ref={emblaRef}>
        <div className="flex">
          {data &&
            data.map((slide, index) => (
              <div
                key={index}
                className="flex-[0_0_25%] min-w-0 flex items-baseline"
              >
                <Link to={getSlideLink(slide)}>
                  <div className="text-[#0ea5e9]">
                    <SliderItem slide={slide} />
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CustomCarousel;
