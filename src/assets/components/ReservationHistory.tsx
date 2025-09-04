import React, { useEffect, useState } from "react";
import { getPatientHistory } from "../api/patientApi";

interface Reservation {
  id: number;
  date: string;
  time: string;
  paid: boolean;
}

interface ReservationHistoryProps {
  patientId: number;
}

const ReservationHistory: React.FC<ReservationHistoryProps> = ({ patientId }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const history: Reservation[] = await getPatientHistory(patientId);
        setReservations(history);
      } catch (err) {
        console.error(err);
        alert("Error fetching reservation history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [patientId]);

  return (
    <div className="p-4 border rounded-md mt-4">
      <h2 className="text-lg font-bold mb-2">Reservation History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : reservations.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Time</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td className="border px-2 py-1">{res.date}</td>
                <td className="border px-2 py-1">{res.time}</td>
                <td className="border px-2 py-1">
                  {res.paid ? "✅ Paid" : "❌ Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reservations found</p>
      )}
    </div>
  );
};

export default ReservationHistory;
