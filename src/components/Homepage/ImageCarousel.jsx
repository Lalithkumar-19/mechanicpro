import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageCarousel = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get('https://mechpro-backend.vercel.app/api/carousel/public');
        setSlides(response.data);
      } catch (error) {
        console.error('Error fetching carousel slides:', error);
      }
    };

    fetchSlides();
  }, []);

  if (slides.length === 0) return null;

  // Duplicate slides to create seamless infinite scroll effect
  const displaySlides = [...slides, ...slides, ...slides];

  return (
    <div className="w-full overflow-hidden bg-black py-12">
      <div className="relative w-full">
        <div className="flex animate-scroll hover:pause">
          {displaySlides.map((slide, index) => (
            <div
              key={`${slide._id}-${index}`}
              className="flex-shrink-0 w-[300px] md:w-[400px] aspect-video mx-4 rounded-xl overflow-hidden shadow-lg border border-gray-800 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={slide.imageUrl}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .animate-scroll {
          animation: scroll 40s linear infinite;
          width: max-content;
        }
        
        .hover\\:pause:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
      `}</style>
    </div>
  );
};

export default ImageCarousel;
