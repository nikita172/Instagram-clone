import React, { useState } from 'react';
import './carousel.css';

const postImages = [
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2Fyc3xlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
  'https://img.freepik.com/free-photo/blue-black-muscle-car-with-license-plate-that-says-trans-front_1340-23399.jpg?w=2000',
  'https://imgd-ct.aeplcdn.com/370x208/n/cw/ec/128413/scorpio-exterior-right-front-three-quarter-46.jpeg?isig=0&q=75',
  // Add more post image URLs
];

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNextPost = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % postImages.length);
  };

  const handlePreviousPost = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + postImages.length) % postImages.length);
  };

  return (
    <div className="post-carousel">
      <div className="post-previous-button" onClick={handlePreviousPost}>
        <img src="/images/chevron-left.svg" />
      </div>
      <div className="post-image-container">
        <img src={postImages[activeIndex]} alt={`Post ${activeIndex + 1}`} className="post-image" />
      </div>
      <div className="post-next-button" onClick={handleNextPost}>
        <img src="/images/chevron-right.svg" />
      </div>
    </div>
  );
};

export default Carousel;
