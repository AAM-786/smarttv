import { useState, useEffect } from "react";

interface Photo {
  id: string;
  url: string;
  title: string;
  date: string;
}

const mockPhotos: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    title: "Family Beach Vacation 2024",
    date: "December 15, 2024"
  },
  {
    id: "2", 
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    title: "Mountain Adventure 2023",
    date: "October 10, 2023"
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    title: "Family Portrait",
    date: "August 5, 2023"
  }
];

export function PhotoSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockPhotos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % mockPhotos.length);
  };

  const previousPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + mockPhotos.length) % mockPhotos.length);
  };

  const toggleSlideshow = () => {
    setIsPlaying(!isPlaying);
  };

  const currentPhoto = mockPhotos[currentIndex];

  return (
    <div className="tv-card bg-card rounded-3xl p-8 tv-focus" tabIndex={0}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold flex items-center">
          <i className="fas fa-images text-primary mr-3"></i>
          Family Photos
        </h3>
        <div className="flex space-x-3">
          <button
            className="tv-focus bg-muted hover:bg-primary hover:text-primary-foreground rounded-full p-3 transition-all duration-300"
            onClick={previousPhoto}
            tabIndex={0}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            className="tv-focus bg-primary text-primary-foreground hover:bg-primary/90 rounded-full p-3 transition-all duration-300"
            onClick={toggleSlideshow}
            tabIndex={0}
          >
            <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
          </button>
          <button
            className="tv-focus bg-muted hover:bg-primary hover:text-primary-foreground rounded-full p-3 transition-all duration-300"
            onClick={nextPhoto}
            tabIndex={0}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div className="relative h-80 rounded-xl overflow-hidden mb-4">
        <img
          src={currentPhoto.url}
          alt={currentPhoto.title}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <p className="text-white font-semibold text-xl mb-1">
            {currentPhoto.title}
          </p>
          <p className="text-gray-300 text-lg">
            {currentPhoto.date}
          </p>
        </div>
      </div>
      
      <div className="flex justify-center space-x-2">
        {mockPhotos.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-primary' : 'bg-muted'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
