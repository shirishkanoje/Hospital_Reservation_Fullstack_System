import React, { useState, useEffect } from "react";
import { getAvailableSlots, bookReservation } from "../api/patientApi";

interface Patient {
  id: number;
  name: string;
}

interface BookReservationProps {
  patient: Patient; // Already added patient
}

const BookReservation: React.FC<BookReservationProps> = ({ patient }) => {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;
    const fetchSlots = async () => {
      try {
        const availableSlots: string[] = await getAvailableSlots(date);
        setSlots(availableSlots);
      } catch (err) {
        console.error(err);
        alert("Error fetching slots");
      }
    };
    fetchSlots();
  }, [date]);

  const handleBooking = async () => {
    if (!selectedSlot || !date) return alert("Select date and slot");
    setLoading(true);
    try {
      const response = await bookReservation(patient.id, date, selectedSlot);
      // Redirect to Razorpay payment link
      window.location.href = response.paymentLink;
    } catch (err) {
      console.error(err);
      alert("Error booking reservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md mt-4">
      <h2 className="text-lg font-bold mb-2">Book Reservation for {patient.name}</h2>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      {slots.length > 0 && (
        <select
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          className="border p-2 mb-2 w-full"
        >
            
          <option value="">Select Slot</option>
          {slots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      )}
      <button
        onClick={handleBooking}
        className="bg-green-500 text-white p-2 rounded-md"
        disabled={loading}
      >
        {loading ? "Booking..." : "Book & Pay"}
      </button>
    </div>
  );
};

export default BookReservation;
