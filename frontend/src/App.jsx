import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthUser from "./hooks/useAuthUser";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ExplorePage from "./pages/explore/ExplorePage";
import MessagesPage from "./pages/messages/MessagesPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import BottomNav from "./components/common/BottomNav";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { data: authUser, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="flex max-w-[1280px] mx-auto min-h-screen">
        {authUser && <Sidebar />}
        <main className={`flex-1 flex min-w-0 ${authUser ? "pb-16 md:pb-0" : ""}`}>
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
            <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
            <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/explore" element={authUser ? <ExplorePage /> : <Navigate to="/login" />} />
            <Route path="/messages" element={authUser ? <MessagesPage /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        {authUser && <RightPanel />}
      </div>
      {authUser && <BottomNav />}
      <Toaster position="bottom-center" toastOptions={{ style: { background: "#16181c", color: "#e7e9ea", border: "0.5px solid #2f3336" } }} />
    </>
  );
}

export default App;