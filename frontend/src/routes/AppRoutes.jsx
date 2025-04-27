import { Routes, Route, Navigate } from "react-router";
import { useUser } from "../context/UserContext";
import Spinner from "../components/custom components/spinner";
import LandingPage from "../views/LandingPage";
import Signin from "../views/Signin";
import Navbar from "../components/custom components/Navbar";
import Footer from "../components/custom components/Footer";
import JoinMeetings from "../views/JoinMeetings";
import CreateMeetings from "../views/CreateMeetings";
import ViewRoom from "../views/ViewRoom";
import { useEffect } from "react";
const VITE_API_BASE=import.meta.env.VITE_API_BASE;
import axios from "axios";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useUser();


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<Signin />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                // <ProtectedRoute>
                  <LandingPage />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/join-meetings"
              element={
                <ProtectedRoute>
                  <JoinMeetings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-meetings"
              element={
                  <CreateMeetings />
              }
            />
             <Route
              path="/view-room/:roomId"
              element={
                  <ViewRoom />
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AppRoutes;
