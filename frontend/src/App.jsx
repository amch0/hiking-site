import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import "./styles/navbar.css";
import "./styles/home.css";
import "./styles/destination.css";
import "./styles/crew.css";
import "./styles/equipmetn.css";
import Navbar from "./Navbar";
import Home from "./homePage/homePage";
import Login from "./signup-login/loginPage";
import Signup from "./signup-login/signupPage";
import ResetPassword from "./signup-login/resetPassword";
import Crew from "./homePage/components/Crew";
import Destination from "./homePage/components/Destination";
import Equipment from "./homePage/components/Equipment";
import TourDetails from "./tours/TourDetails";
import CustomFooter from "./customFooter";
function App() {
  const [selectedLink, setSelectedLink] = useState("");
  const navigate = useNavigate();
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home setSelectedLink={setSelectedLink} />} />
        <Route
          path="/destination"
          element={<Destination setSelectedLink={setSelectedLink} />}
        />
        <Route
          path="/crew"
          element={<Crew setSelectedLink={setSelectedLink} />}
        />
        <Route
          path="/equipment"
          element={<Equipment setSelectedLink={setSelectedLink} />}
        />
        <Route path="/route/:routeId" element={<TourDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
