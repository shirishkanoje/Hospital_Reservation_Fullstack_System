import React, { useState, useEffect } from "react";
import "../styles/global.css";
import medIcon from "../images/med.png";

// ✅ Backend URL
const BASE_URL = "https://hospital-reservation-backend-1.onrender.com";

interface PatientReservationDTO {
  name: string;
  reservationDate: string;
  reservationTime: string;
}

const Dashboard: React.FC = () => {
  const [patients, setPatients] = useState<PatientReservationDTO[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  // ✅ FIXED (IST safe)
  const todayDate = new Date().toISOString().split("T")[0];

  const todayDisplay = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // =========================
  // 🔹 FETCH TODAY PATIENTS
  // =========================
  const fetchPendingPatients = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/admin/patients?date=${todayDate}`
      );

      const data: PatientReservationDTO[] = await res.json();
      setPatients(data);
    } catch {
      setPatients([]);
    }
  };

  useEffect(() => {
    fetchPendingPatients();
    const interval = setInterval(fetchPendingPatients, 10000);
    return () => clearInterval(interval);
  }, []);

  // =========================
  // 🔹 FETCH SLOTS (FIXED)
  // =========================
  useEffect(() => {
    if (!date) {
      setAvailableSlots([]);
      setSelectedSlot("");
      return;
    }

    const fetchSlots = async () => {
      try {
        const [slotsRes, bookedRes] = await Promise.all([
          fetch(`${BASE_URL}/api/patient/available-slots?date=${date}`),
          fetch(`${BASE_URL}/api/admin/patients?date=${date}`)
        ]);

        const allSlots: string[] = await slotsRes.json();
        const booked: PatientReservationDTO[] = await bookedRes.json();

        const now = new Date();

        // ✅ IMPORTANT FIX
        const todayStr = new Date().toISOString().split("T")[0];
        const isToday = date === todayStr;

        const bookedTimes = booked.map((p) =>
          p.reservationTime.slice(0, 5)
        );

        const filtered = allSlots
          .filter((slot) => {
            const [h, m] = slot.split(":").map(Number);
            const slotTime = new Date(date);
            slotTime.setHours(h, m, 0, 0);

            const isBooked = bookedTimes.includes(slot.slice(0, 5));

            // ✅ FIXED LOGIC
            if (isToday) {
              return !isBooked && slotTime > now;
            } else {
              // FUTURE DATE → no time filtering
              return !isBooked;
            }
          })
          .map((slot) => slot.slice(0, 5));

        setAvailableSlots(filtered);
        setSelectedSlot("");
      } catch (err) {
        console.error(err);
        setAvailableSlots([]);
      }
    };

    fetchSlots();
  }, [date]);

  // =========================
  // 🔹 ADD PATIENT
  // =========================
  const addPatient = async () => {
    if (!name || !contact || !date || !selectedSlot) return;

    try {
      const res = await fetch(
        `${BASE_URL}/api/patient/book-with-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            contact,
            date,
            time: selectedSlot,
          }),
        }
      );

      const data = await res.json();

      window.open(data.paymentLink, "_blank");

      setName("");
      setContact("");
      setDate("");
      setAvailableSlots([]);
      setSelectedSlot("");

      fetchPendingPatients();
    } catch (err) {
      console.error("Booking failed", err);
    }
  };

  return (
    <>
      <div className="background-layer"></div>

      <div className="med-layer">
        <img src={medIcon} alt="med-icon" className="med-floating" />
      </div>

      <div className="dashboard-container">

        {/* 🔹 Pending Patients */}
        <div className="dashboard-card">
          <h2>Pending Patients</h2>
          <h3>({todayDisplay})</h3>

          {patients.length === 0 ? (
            <p>No pending patients found</p>
          ) : (
            <ul className="patient-list">
              {patients.map((p, i) => (
                <li key={i}>
                  <strong>{p.name}</strong> | {p.reservationDate} | {p.reservationTime}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🔹 Registration */}
        <div className="dashboard-card">
          <h1>Patient Registration</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addPatient();
            }}
          >
            <input
              type="text"
              placeholder="Patient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />

            <h2>Select Date</h2>

            <input
              type="date"
              min={todayDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            {/* Slots */}
            {availableSlots.length > 0 && (
              <>
                <h2>Select Time Slot</h2>

                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                >
                  <option value="">-- Select Slot --</option>

                  {availableSlots.map((slot, idx) => (
                    <option key={idx} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* No slots */}
            {date && availableSlots.length === 0 && (
              <p style={{ color: "red" }}>
                No slots available for selected date
              </p>
            )}

            <button
              type="submit"
              disabled={!name || !contact || !date || !selectedSlot}
            >
              Add & Book
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
