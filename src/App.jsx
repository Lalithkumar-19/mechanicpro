import React, { useEffect, useState } from 'react'
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import FindMechanic from './pages/FindMechanic';
import Profile from './pages/Profile';
import BookingPage from './pages/BookingPage';
import MechanicDashboard from './pages/MechanicDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import MechanicLogin from './pages/MechanicLogin';
import { ToastContainer, toast } from 'react-toastify';
import { getFcmToken, requestNotificationPermission, sendTokenToBackend, setupFCM } from './notifications/Notifications';

const App = () => {

  const [fcmToken, setFcmToken] = useState(null);
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
    const admin = localStorage.getItem('admin_info');
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


  console.log(fcmToken, "fcm tiken")



  return (
    <Router>
      <div className='bg-black '>
        <ToastContainer />
        <Header />

        {/* Notification Permission Button - Optional */}
        {/* {!fcmToken && (
          <div className="fixed bottom-4 right-4 z-50">
            <button 
              onClick={requestNotificationPermission}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
            >
              <span>🔔</span>
              <span>Enable Notifications</span>
            </button>
          </div>
        )} */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLoginSuccess={requestNotificationPermission} />} />
          <Route path='/find-mechanics' element={<FindMechanic />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
          <Route path="/mechanic-login" element={<MechanicLogin onLoginSuccess={requestNotificationPermission} />} />
          <Route path='admin' element={<SuperAdminDashboard />} />
          <Route path="/*" element={
            <div className='mt-[200px]'>
              <h1 className='text-4xl font-bold text-white'>404 Not Found</h1>
            </div>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App;