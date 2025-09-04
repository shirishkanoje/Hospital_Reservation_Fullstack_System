import React, { useState, useEffect } from "react";
import { getAvailableSlots } from "../api/patientApi";

interface AvailableSlotsProps {
  date: string;
}

const AvailableSlots: React.FC<AvailableSlotsProps> = ({ date }) => {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      setLoading(true);
      try {
        const availableSlots: string[] = await getAvailableSlots(date);
        setSlots(availableSlots);
      } catch (err) {
        console.error(err);
        alert("Error fetching available slots");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [date]);

  return (
    <div className="p-4 border rounded-md mt-4">
      <h2 className="text-lg font-bold mb-2">Available Slots on {date}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : slots.length > 0 ? (
        <ul className="list-disc pl-5">
          {slots.map((slot) => (
            <li key={slot}>{slot}</li>
          ))}
        </ul>
      ) : (
        <p>No slots available</p>
      )}
    </div>
  );
};

export default AvailableSlots;
