import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase/config';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import TripPlanPage from './pages/TripPlanPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import ExplorePage from './pages/ExplorePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [generatedTrips, setGeneratedTrips] = useState([]);
  const [favoriteDestinations, setFavoriteDestinations] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ROUTE GUARD: Prevent accessing other pages if logged out
  useEffect(() => {
    if (!user && currentPage !== 'landing' && currentPage !== 'login') {
      setCurrentPage('landing');
    }
  }, [user, currentPage]);

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setCurrentPage('setup');
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
  const handleStartPlan = () => {
    if (!user) {
      setCurrentPage('login');
    } else {
      setCurrentPage('setup');
    }
  };

  const handleGenerateTrip = (data) => {
    setTripData(data);
    setGeneratedTrips(prev => [...prev, data]);
    setCurrentPage('plan');
  };

  const handleToggleFavorite = (place) => {
    setFavoriteDestinations(prev => {
      if (prev.find(p => p.id === place.id)) {
        return prev.filter(p => p.id !== place.id);
      }
      return [...prev, place];
    });
  };

  return (
    <>
      {currentPage !== 'login' && (
        <Navbar 
          user={user} 
          onLogin={handleLoginClick} 
          onLogout={handleLogout} 
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        />
      )}
      
      <div key={currentPage} className="page-transition">
        {currentPage === 'landing' && (
          <LandingPage user={user} onStartPlan={handleStartPlan} />
        )}
        {currentPage === 'setup' && user && (
          <SetupPage user={user} onGenerate={handleGenerateTrip} />
        )}
        {currentPage === 'plan' && user && (
          <TripPlanPage user={user} tripData={tripData} />
        )}
        {currentPage === 'profile' && user && (
          <ProfilePage user={user} generatedTrips={generatedTrips} favoriteDestinations={favoriteDestinations} onNavigate={setCurrentPage} />
        )}
        {currentPage === 'explore' && (
          <ExplorePage onNavigate={setCurrentPage} favoriteDestinations={favoriteDestinations} onToggleFavorite={handleToggleFavorite} />
        )}
        {currentPage === 'login' && !user && (
          <LoginPage onGoogleSignIn={handleGoogleSignIn} onNavigate={setCurrentPage} />
        )}
      </div>
    </>
  );
}