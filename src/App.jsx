import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase/config';
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import TripPlanPage from './pages/TripPlanPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [tripData, setTripData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ROUTE GUARD: Prevent accessing other pages if logged out
  useEffect(() => {
    if (!user && currentPage !== 'landing') {
      setCurrentPage('landing');
    }
  }, [user, currentPage]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentPage('landing'); // Redirect to home on logout
    setTripData(null);
  };

  // ENFORCE LOGIN ON BUTTON CLICK
  const handleStartPlan = async () => {
    if (!user) {
      try {
        await signInWithPopup(auth, googleProvider);
        setCurrentPage('setup'); // Proceed to setup after successful login
      } catch (error) {
        console.error("Login cancelled or failed", error);
      }
    } else {
      setCurrentPage('setup');
    }
  };

  const handleGenerateTrip = (data) => {
    setTripData(data);
    setCurrentPage('plan');
  };

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage user={user} onLogin={handleLogin} onLogout={handleLogout} onStartPlan={handleStartPlan} />
      )}
      {currentPage === 'setup' && user && (
        <SetupPage user={user} onLogin={handleLogin} onLogout={handleLogout} onGenerate={handleGenerateTrip} />
      )}
      {currentPage === 'plan' && user && (
        <TripPlanPage user={user} onLogin={handleLogin} onLogout={handleLogout} tripData={tripData} />
      )}
    </>
  );
}