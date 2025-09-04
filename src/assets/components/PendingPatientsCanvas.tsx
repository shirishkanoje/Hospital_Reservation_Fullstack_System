import React, { useEffect, useRef, useState } from "react";
import { getPendingPatientsToday } from "../api/patientApi";

interface Patient {
  id: number;
  name: string;
  contactNumber?: string;
  date?: string;
  time?: string;
}

const PendingPatientsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [patients, setPatients] = useState<Patient[]>([]);

  // Fetch pending patients today
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPendingPatientsToday();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching pending patients:", error);
      }
    };
    fetchPatients();
  }, []);

  // Draw patients on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set styles
    ctx.font = "16px Arial";
    ctx.fillStyle = "#333";

    // Title
    ctx.fillText("Today's Pending Patients", 10, 30);

    // Draw each patient
    patients.forEach((p, index) => {
      const y = 60 + index * 30;
      ctx.fillText(
        `${index + 1}. ${p.name} - ${p.contactNumber || "No contact"} - ${
          p.time || "No time"
        }`,
        10,
        y
      );
    });
  }, [patients]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      style={{ border: "1px solid #ccc", marginTop: "20px" }}
    />
  );
};

export default PendingPatientsCanvas;
