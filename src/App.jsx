import React, { useEffect, useState } from 'react'
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import FindMechanic from './pages/FindMechanic';
import Profile from './pages/Profile';
import BookingPage from './pages/BookingPage';
import MechanicDashboard from './pages/MechanicDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import MechanicLogin from './pages/MechanicLogin';
import { ToastContainer } from 'react-toastify';
import { getFcmToken, requestNotificationPermission, sendTokenToBackend, setupFCM } from './notifications/Notifications';

// Wrapper component to access useLocation
const AppContent = () => {
  const location = useLocation();
  const [fcmToken, setFcmToken] = useState(null);

  // Check if current path should hide header/footer
  const shouldHideHeaderFooter = () => {
    const path = location.pathname;
    return path === '/mechanic-dashboard' || path === '/admin';
  };

  useEffect(() => {
    console.log(getFcmToken(), "fcm");
    setupFCM(); // handle foreground messages
  }, []);



  useEffect(() => {
    const setup = async () => {
      const user = localStorage.getItem('user_token');
      const mechanic = localStorage.getItem('mechanic_token');
      const admin = localStorage.getItem('admin_token');

      if (user || mechanic || admin) {
        if (Notification.permission === "granted") {
          // Already granted → get token silently
          const token = await requestNotificationPermission();
          setFcmToken(token);
        } else if (Notification.permission === "default") {
          // Ask for permission
          const token = await requestNotificationPermission();
          setFcmToken(token);
        } else {
          console.warn("Notifications blocked by user.");
        }
      }
    };
    setup();

  }, []);

  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    const mechanic = localStorage.getItem('mechanic_info');
    const admin = localStorage.getItem('admin_id');
    if (fcmToken !== null) {
      if (user !== null) {
        const userId = JSON.parse(localStorage.getItem('userInfo'))._id;
        console.log("ready to send fcm token to backend");
        sendTokenToBackend(fcmToken, userId, 'user');
      }
      if (mechanic !== null) {
        const userId = JSON.parse(localStorage.getItem('mechanic_info')).id;
        console.log("ready to send fcm token to backend");
        sendTokenToBackend(fcmToken, userId, 'mechanic');
      }
      if (admin !== null) {
        const userId = localStorage.getItem('admin_id');
        console.log("ready to send fcm token to backend");
        sendTokenToBackend(fcmToken, userId, 'admin');
      }
    }
  }, [fcmToken]);


  console.log(fcmToken, "fcm token")



  return (
    <div className='bg-black w-full min-h-screen flex flex-col overflow-x-hidden'>
      <ToastContainer />
      {!shouldHideHeaderFooter() && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLoginSuccess={requestNotificationPermission} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/find-mechanics' element={<FindMechanic />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
        <Route path="/mechanic-login" element={<MechanicLogin onLoginSuccess={requestNotificationPermission} />} />
        <Route path='/admin' element={<SuperAdminDashboard />} />
        <Route path="/*" element={
          <div className='mt-[200px]'>
            <h1 className='text-4xl font-bold text-white'>404 Not Found</h1>
          </div>
        } />
      </Routes>
      
      {!shouldHideHeaderFooter() && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;