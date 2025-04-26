import { Routes, Route } from "react-router";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useUser();
  
    if (loading) {
      return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
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
      <div className="">Navbar</div>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentor-profile"
              element={
                <ProtectedRoute allowedRoles={["mentor"]}>
                  <MentorProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentor-profile/:mentorId"
              element={
                <ProtectedRoute>
                  <MentorProfile />
                </ProtectedRoute>
              }
            />

            {/* Startup Profile Routes */}
            <Route
              path="/startup-profile"
              element={
                <ProtectedRoute allowedRoles={["founder"]}>
                  <StartupProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/startup-dashboard"
              element={
                <ProtectedRoute allowedRoles={["founder"]}>
                  <FounderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["mentor"]}>
                  <MentorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/startup-profile/:userId"
              element={
                <ProtectedRoute>
                  <StartupProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/startup-pitch/:id"
              element={
                <ProtectedRoute>
                  <StartupPitch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/find-mentors"
              element={
                <ProtectedRoute>
                  <FindMentors />
                </ProtectedRoute>
              }
            />

            <Route path="/chat/:mentorId" element={<Chatpage />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatSessionsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <div className="">footer</div>
      </div>
    </>
  );
};


export default AppRoutes;