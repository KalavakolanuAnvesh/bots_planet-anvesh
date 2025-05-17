import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Pricing from "./components/Pricing";
import Solutions from "./components/Solutions";
import Login from "./components/Login";
import Signup from "./components/Signup/Signup";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Contact from "./components/Contact";
import UserLanding from "./components/UserLanding";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import CustomerSegment from './components/UserLandingPages/CustomerSegment';
import ProductInformation from './components/UserLandingPages/ProductInformation';
import BuyerProfile from './components/UserLandingPages/BuyerProfile';
import PotentialCustomers from './components/UserLandingPages/PotentialCustomers';
import PotentialBuyers from './components/UserLandingPages/PotentialBuyers';
import ConversationTemplates from './components/UserLandingPages/ConversationTemplates';
import ScheduleAppointments from './components/UserLandingPages/ScheduleAppointments';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/userlanding" element={<UserLanding />}>
            <Route index element={<Navigate to="customer-segment" replace />} />
            <Route path=":section" element={<UserLanding />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
