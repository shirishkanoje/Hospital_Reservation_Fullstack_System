import React, { useEffect, useState } from "react";
import scanningGif from "../images/Scanning.gif"; // ← import your GIF
import "../styles/global.css";

const Preloader: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loaded) return null;

  return (
    <div className="preloader">
      <img src={scanningGif} alt="Loading..." className="preloader-gif" />
      <div className="preloader-text">Loading Hospital Dashboard...</div>
    </div>
  );
};

export default Preloader;
