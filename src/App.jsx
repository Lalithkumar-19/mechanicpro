import React from 'react'
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
const App = () => {
  return (
    <Router>
      <div className='bg-black '>
        <Header />
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path='/find-mechanics' element={<FindMechanic />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
          <Route path='admin' element={<SuperAdminDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
