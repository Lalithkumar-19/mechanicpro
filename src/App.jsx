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
import MechanicLogin from './pages/MechanicLogin';
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
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
          <Route path="/mechanic-login" element={<MechanicLogin />} />
          <Route path='admin' element={<SuperAdminDashboard />} />
          <Route path="/*" Component={
            <>
              <div className='mt-[200px]'>
                <h1 className='text-4xl font-bold text-white'>404 Not Found</h1>
              </div>
            </>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
