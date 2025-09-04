// import React, { useState, useEffect } from "react";
// import "../styles/global.css";
// import medIcon from "../images/med.png";

// const Dashboard: React.FC = () => {
//   const [patients, setPatients] = useState<{ name: string; contact: string; date: string; time: string }[]>([]);
//   const [name, setName] = useState("");
//   const [contact, setContact] = useState("");
//   const [date, setDate] = useState("");
//   const [availableSlots, setAvailableSlots] = useState<string[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState("");

//   const today = new Date().toLocaleDateString("en-GB", {
//   day: "numeric",
//   month: "short",
//   year: "numeric",
// });


//   useEffect(() => {
//     if (date) {
//       setAvailableSlots(["09:00", "09:15", "09:30", "09:45", "10:00"]);
//       setSelectedSlot("");
//     } else {
//       setAvailableSlots([]);
//       setSelectedSlot("");
//     }
//   }, [date]);

//   const addPatient = () => {
//     if (name.trim() && contact.trim() && date && selectedSlot) {
//       setPatients([...patients, { name, contact, date, time: selectedSlot }]);
//       setName("");
//       setContact("");
//       setDate("");
//       setAvailableSlots([]);
//       setSelectedSlot("");
//     }
//   };

//   return (
//     <>
//       {/* Background Layer */}
//       <div className="background-layer"></div>

//       {/* Med Icon Layer */}
//       <div className="med-layer">
//         <img src={medIcon} alt="med-icon" className="med-floating" />
//       </div>

//       {/* Main Content */}
//       <div className="dashboard-container">
//         <div className="dashboard-card">
//           <h2>Pending Patients </h2>
//           <h2>({ today})</h2>
//           {patients.length === 0 ? (
//             <p>No patients added yet</p>
//           ) : (
//             <ul className="patient-list">
//               {patients.map((p, i) => (
//                 <li key={i}>
//                   <strong>{p.name}</strong> || {p.contact} || {p.date} || {p.time}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <div className="dashboard-card">
//           <h1>Patient Registration</h1>
//           <form onSubmit={(e) => { e.preventDefault(); addPatient(); }}>
//             <input
//               type="text"
//               placeholder="Patient Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Contact Number"
//               value={contact}
//               onChange={(e) => setContact(e.target.value)}
//             />
//             <h2>Select Date</h2>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//             />
//             {availableSlots.length > 0 && (
//               <>
//                 <h2>Select Time Slot</h2>
//                 <select
//                   value={selectedSlot}
//                   onChange={(e) => setSelectedSlot(e.target.value)}
//                 >
//                   <option value="">-- Select Slot --</option>
//                   {availableSlots.map((slot, idx) => (
//                     <option key={idx} value={slot}>{slot}</option>
//                   ))}
//                 </select>
//               </>
//             )}
//             <button type="submit" disabled={!name || !contact || !date || !selectedSlot}>
//               Add & Book
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Dashboard;
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

  const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const todayDisplay = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // 🔹 Pending Patients: Shows only today's patients, hides contact, filters expired slots
  const fetchPendingPatients = () => {
    fetch(`http://localhost:8182/api/admin/patients?date=${todayDate}`)
      .then((res) => res.json())
      .then((data: PatientReservationDTO[]) => {
        const now = new Date();
        const filtered = data.filter((p) => {
          const [hour, minute] = p.reservationTime.split(":").map(Number);
          const slotTime = new Date(p.reservationDate);
          slotTime.setHours(hour, minute, 0, 0);
          return slotTime.getTime() > now.getTime();
        });
        setPatients(filtered);
      })
      .catch(() => setPatients([]));
  };

  useEffect(() => {
    fetchPendingPatients();
  }, []);

  // 🔹 Available Slots: Fetched from backend, filters expired slots for today
  useEffect(() => {
    if (!date) {
      setAvailableSlots([]);
      setSelectedSlot("");
      return;
    }

    fetch(`http://localhost:8182/api/patient/available-slots?date=${date}`)
      .then((res) => res.json())
      .then((data: string[]) => {
        const now = new Date();
        const selectedDate = new Date(date);
        const isToday = now.toDateString() === selectedDate.toDateString();

        const filtered = data
          .map((t) => t.slice(0, 5)) // HH:mm:ss → HH:mm
          .filter((slot) => {
            if (!isToday) return true;
            const [hour, minute] = slot.split(":").map(Number);
            const slotTime = new Date(date);
            slotTime.setHours(hour, minute, 0, 0);
            return slotTime.getTime() > now.getTime();
          });

        setAvailableSlots(filtered);
        setSelectedSlot("");
      })
      .catch(() => setAvailableSlots([]));
  }, [date]);

  // 🔹 Register patient
  const addPatient = () => {
    if (name.trim() && contact.trim() && date && selectedSlot) {
      const payload = { name, contact, date, time: selectedSlot };

      fetch("http://localhost:8182/api/patient/book-with-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          window.open(data.paymentLink, "_blank");
          localStorage.setItem("patientId", data.patientId);
          setName("");
          setContact("");
          setDate("");
          setAvailableSlots([]);
          setSelectedSlot("");
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
        <div className="dashboard-card">
          <h2>Pending Patients</h2>
          <h2>({todayDisplay})</h2>
          {patients.length === 0 ? (
            <p>No pending patients found</p>
          ) : (
            <ul className="patient-list">
              {patients.map((p, i) => (
                <li key={i}>
                  <strong>{p.name}</strong> || {p.reservationDate} || {p.reservationTime}
                </li>
              ))}
            </ul>
          )}
        </div>

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
            <button type="submit" disabled={!name || !contact || !date || !selectedSlot}>
              Add & Book
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
