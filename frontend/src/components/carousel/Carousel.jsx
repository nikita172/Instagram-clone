import React, { useState } from 'react';
import './carousel.css';


let images = [
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2Fyc3xlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
  'https://img.freepik.com/free-photo/blue-black-muscle-car-with-license-plate-that-says-trans-front_1340-23399.jpg?w=2000',
  'https://imgd-ct.aeplcdn.com/370x208/n/cw/ec/128413/scorpio-exterior-right-front-three-quarter-46.jpeg?isig=0&q=75',
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTavvhGZzWDkeUf9evz55xRHSimT6L3mLdfv9Is5_h_&s"
  // Add more post image URLs
];
const Carousel = () => {

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="carousel">
      <button className="arrow left-arrow" onClick={handlePrev}><img src="/images/chevron-left.svg" /></button>
      <img className="carousel-image" src={images[activeIndex]} alt={`Image ${activeIndex + 1}`} />
      <button className="arrow right-arrow" onClick={handleNext}><img src="/images/chevron-right.svg" /></button>
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
