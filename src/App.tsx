
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Preloader from "./assets/components/Preloader";
import Navbar from "./assets/components/Navbar";
import Dashboard from "./assets/pages/Dashboard";
import RegistrationHistory from "./assets/pages/RegistrationHistory";
import OurTeam from "./assets/pages/OurTeam";
import HospitalFacilities from "./assets/pages/HospitalFacilities";

function App() {
  return (
    <Router>
      <Preloader />
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/registration-history" element={<RegistrationHistory />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/hospital-facilities" element={<HospitalFacilities />} />
      </Routes>
    </Router>
  );
}

export default App;
