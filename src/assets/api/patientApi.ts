import axios from "axios";

// Base URL of your backend
const BASE_URL = "http://localhost:8182/api/patient";

export const addPatient = async (patient: { name: string; contactNumber: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/add`, patient);
    return response.data;
  } catch (error) {
    console.error("Error adding patient:", error);
    throw error;
  }
};

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

export const getPendingPatientsToday = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/pending-today`);
    return response.data;
  } catch (error) {
    console.error("Error fetching today's pending patients:", error);
    throw error;
  }
};
