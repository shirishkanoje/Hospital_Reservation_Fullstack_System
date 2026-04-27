import React, { useState, useEffect } from "react";
import "../styles/global.css";
import medIcon from "../images/med.png";

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

  // ✅ IST SAFE DATE (FIXED)
  const todayDate = new Date().toLocaleDateString("en-CA");

  const todayDisplay = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // =========================
  // 🔹 FETCH PENDING PATIENTS
  // =========================
  const fetchPendingPatients = () => {
    fetch(`https://hospital-reservation-backend-1.onrender.com/api/admin/patients?date=${todayDate}`)
      .then((res) => res.json())
      .then((data: PatientReservationDTO[]) => {
        // ✅ SHOW ALL TODAY'S PATIENTS (no wrong filtering)
        setPatients(data);
      })
      .catch(() => setPatients([]));
  };

  // ✅ AUTO REFRESH EVERY 10s
  useEffect(() => {
    fetchPendingPatients();

    const interval = setInterval(fetchPendingPatients, 10000);
    return () => clearInterval(interval);
  }, []);

  // =========================
  // 🔹 FETCH AVAILABLE SLOTS
  // =========================
  useEffect(() => {
    if (!date) {
      setAvailableSlots([]);
      setSelectedSlot("");
      return;
    }

    const fetchSlots = async () => {
      try {
        const [allSlotsRes, bookedRes] = await Promise.all([
          fetch(`https://hospital-reservation-backend-1.onrender.com/api/patient/available-slots?date=${date}`),
          fetch(`https://hospital-reservation-backend-1.onrender.com/api/admin/patients?date=${date}`)
        ]);

        const allSlotsRaw: string[] = await allSlotsRes.json();
        const bookedPatients: PatientReservationDTO[] = await bookedRes.json();

        const now = new Date();
        const selectedDate = new Date(date);
        const isToday = now.toDateString() === selectedDate.toDateString();

        const bookedTimes = bookedPatients.map(p => p.reservationTime.slice(0, 5));

        const filtered = allSlotsRaw
          .filter(raw => {
            const [hour, minute] = raw.split(":").map(Number);
            const slotTime = new Date(date);
            slotTime.setHours(hour, minute, 0, 0);

            const isBooked = bookedTimes.includes(raw.slice(0, 5));
            const isFuture = !isToday || slotTime > now;

            return !isBooked && isFuture;
          })
          .map(raw => raw.slice(0, 5));

        setAvailableSlots(filtered);
        setSelectedSlot("");
      } catch {
        setAvailableSlots([]);
      }
    };

    fetchSlots();
  }, [date]);

  // =========================
  // 🔹 ADD PATIENT
  // =========================
  const addPatient = () => {
    if (name.trim() && contact.trim() && date && selectedSlot) {
      const payload = { name, contact, date, time: selectedSlot };

      fetch("https://hospital-reservation-backend-1.onrender.com/api/patient/book-with-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          window.open(data.paymentLink, "_blank");
          localStorage.setItem("patientId", data.patientId);

          // reset
          setName("");
          setContact("");
          setDate("");
          setAvailableSlots([]);
          setSelectedSlot("");

          // refresh list instantly
          fetchPendingPatients();
        })
        .catch(() => {});
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
          <h2>({todayDisplay})</h2>

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

        {/* 🔹 Registration Form */}
        <div className="dashboard-card">
          <h1>Patient Registration</h1>

          <form onSubmit={(e) => { e.preventDefault(); addPatient(); }}>
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            {availableSlots.length > 0 && (
              <>
                <h2>Select Time Slot</h2>

                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                >
                  <option value="">-- Select Slot --</option>

                  {availableSlots.map((slot, idx) => (
                    <option key={idx} value={slot}>{slot}</option>
                  ))}
                </select>
              </>
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
