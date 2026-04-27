import axios from "axios";

// ✅ PRODUCTION BACKEND URL
const BASE_URL = "https://hospital-reservation-backend-1.onrender.com/api/patient";

// 🔹 Add Patient
export const addPatient = async (patient: { name: string; contactNumber: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/add`, patient);
    return response.data;
  } catch (error) {
    console.error("Error adding patient:", error);
    throw error;
  }
};

// 🔹 Book Reservation
export const bookReservation = async (
  patientId: number,
  date: string,
  time: string
) => {
  try {
    const response = await axios.post(`${BASE_URL}/book`, null, {
      params: { patientId, date, time },
    });
    return response.data;
  } catch (error) {
    console.error("Error booking reservation:", error);
    throw error;
  }
};

// 🔹 Get Available Slots
export const getAvailableSlots = async (date: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/available-slots`, {
      params: { date },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
};

// 🔹 Get Patient History
export const getPatientHistory = async (patientId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/history`, {
      params: { patientId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reservation history:", error);
    throw error;
  }
};

// 🔹 Get Pending Patients Today (ADMIN SIDE)
export const getPendingPatientsToday = async () => {
  try {
    // ⚠️ FIX: this endpoint is NOT under /api/patient
    const response = await axios.get(
      "https://hospital-reservation-backend-1.onrender.com/api/admin/patients",
      {
        params: {
          date: new Date().toLocaleDateString("en-CA"), // YYYY-MM-DD (IST safe)
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching today's pending patients:", error);
    throw error;
  }
};
