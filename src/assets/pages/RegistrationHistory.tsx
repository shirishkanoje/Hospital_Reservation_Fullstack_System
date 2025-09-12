// import React from "react";
// import "../styles/registration.css";

// const RegistrationHistory: React.FC = () => {
//   return (
//     <div className="registration-container">
//       {/* Background Layer */}
//       <div className="background-layer"></div>

//       {/* Page Content */}
//       <div className="registration-card">
//         <h2>Registration History</h2>
//         <p>This section will display patient registration records.</p>

//         {/* Placeholder Table */}
//         <table className="registration-table">
//           <thead>
//             <tr>
//               <th>Patient ID</th>
//               <th>Name</th>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>001</td>
//               <td>Ravi Kumar</td>
//               <td>2025-09-03</td>
//               <td>09:05</td>
//               <td>Confirmed</td>
//             </tr>
//             <tr>
//               <td>002</td>
//               <td>Meena Joshi</td>
//               <td>2025-09-02</td>
//               <td>10:00</td>
//               <td>Pending</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RegistrationHistory;


import React, { useEffect, useState } from "react";
import "../styles/registration.css";

interface PatientReservationDTO {
  patientId: number;
  name: string;
  age: number;
  contactNumber: string;
  reservationDate: string;
  reservationTime: string;
  paid: boolean;
  status: string;
}

const RegistrationHistory: React.FC = () => {
  const [history, setHistory] = useState<PatientReservationDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const patientId = localStorage.getItem("patientId");

  useEffect(() => {
    if (!patientId) {
      setError("No patient ID found. Please register a patient first.");
      return;
    }

    fetch(`https://hospital-reservation-backend-1.onrender.com/api/patient/history?patientId=${patientId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch history");
        return res.json();
      })
      .then((data: PatientReservationDTO[]) => {
        console.log("Fetched history:", data); // ✅ Debug log
        setHistory(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching history:", err);
        setError("Unable to load registration history.");
        setHistory([]);
      });
  }, [patientId]);

  return (
    <div className="registration-container">
      <div className="background-layer"></div>

      <div className="registration-card">
        <h2>Registration History</h2>

        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="registration-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5}>No history found</td>
                </tr>
              ) : (
                history.map((res, i) => (
                  <tr key={i}>
                    <td>{res.patientId}</td>
                    <td>{res.name}</td>
                    <td>{res.reservationDate}</td>
                    <td>{res.reservationTime}</td>
                    <td>{res.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RegistrationHistory;
