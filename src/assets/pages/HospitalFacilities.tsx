import React, { useEffect, useState } from "react";
import "../styles/facilities.css";
import facility1 from "../images/facility1.jpg";
import facility2 from "../images/facility2.jpg";
import facility3 from "../images/facility3.jpg";

const slides = [
  {
    image: facility1,
    title: "Advanced ICU",
    description: "Equipped with state-of-the-art monitoring and life support systems.",
  },
  {
    image: facility2,
    title: "Radiology Center",
    description: "High-resolution MRI, CT, and X-ray imaging for accurate diagnostics.",
  },
  {
    image: facility3,
    title: "Emergency Ward",
    description: "24/7 trauma care with rapid response and expert medical staff.",
  },
];

const HospitalFacilities: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="facility-slideshow">
  {slides.map((slide, index) => (
    <div
      key={index}
      className={`slide ${index === currentSlide ? "active" : ""}`}
      style={{ backgroundImage: `url(${slide.image})` }}
    >
      <div className="slide-text">
        <h1 className={index === currentSlide ? "fade-title" : ""}>{slide.title}</h1>
        <p className={index === currentSlide ? "fade-description" : ""}>{slide.description}</p>
      </div>
    </div>
  ))}
</div>

  );
};

export default HospitalFacilities;
