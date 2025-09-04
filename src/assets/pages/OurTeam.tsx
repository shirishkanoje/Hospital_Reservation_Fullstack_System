import React from "react";
import "../styles/team.css";
import doc1 from "../images/doc1.png";
import doc2 from "../images/doc2.png";
import doc3 from "../images/doc3.png";

const OurTeam: React.FC = () => {
  return (
    <div className="team-container">
      <div className="background-layer"></div>

      <h1 className="team-heading">Meet Our Team</h1>

      <div className="team-grid">
        <div className="team-member">
          <img src={doc1} alt="Dr. Asha Mehta" />
          <h3>Dr. Asha Mehta</h3>
          <p>Cardiologist with 15+ years of experience in interventional procedures and patient care.</p>
        </div>

        <div className="team-member">
          <img src={doc2} alt="Dr. Rohan Deshmukh" />
          <h3>Dr. Rohan Deshmukh</h3>
          <p>Orthopedic surgeon specializing in joint replacements and sports injury rehabilitation.</p>
        </div>

        <div className="team-member">
          <img src={doc3} alt="Dr. Neha Kulkarni" />
          <h3>Dr. Neha Kulkarni</h3>
          <p>Pediatrician focused on holistic child development and preventive healthcare strategies.</p>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
