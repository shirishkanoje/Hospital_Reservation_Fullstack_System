import React, { useState } from "react";
import { addPatient } from "../api/patientApi";

interface PatientFormProps {
  onPatientAdded: (patient: { id: number; name: string }) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onPatientAdded }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Please enter patient name");
    setLoading(true);
    try {
      const newPatient = await addPatient({ name, contactNumber: contact });
      alert("Patient added successfully!");
      onPatientAdded(newPatient);
      setName("");
      setContact("");
    } catch (err) {
      console.error(err);
      alert("Error adding patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md">
      <h2 className="text-lg font-bold mb-2">Add Patient</h2>
      <input
        type="text"
        placeholder="Patient Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Contact Number"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Patient"}
      </button>
    </form>
  );
};

export default PatientForm;
